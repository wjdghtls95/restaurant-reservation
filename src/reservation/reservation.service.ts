import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from 'src/entity/menu.entity';
import {
  FindOptionsWhere,
  In,
  LessThan,
  MoreThan,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { Restaurant } from '../entity/restaurant.entity';
import { Customer } from '../entity/customer.entity';
import { Reservation } from '../entity/reservation.entity';
import { CreateReservationForm } from './forms/create-reservation.form';
import { CreateReservationDto } from './dtos/create-reservation.dto';
import { MenuDto } from '../menu/dtos/menu.dto';
import { GetReservationDto } from './dtos/get-reservation.dto';
import { GetReservationForm } from './forms/get-reservation.form';
import { UpdateReservationForm } from './dtos/update-reservation.form';
import { UpdateReservationDto } from './forms/update-reservation.dto';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
    @InjectRepository(Menu)
    private menuRepository: Repository<Menu>,
  ) {}

  /**
   * 예약 생성 - 고객
   */
  async createReservation(
    customerId: number,
    createReservationForm: CreateReservationForm,
  ): Promise<CreateReservationDto> {
    const {
      restaurantId,
      startTime,
      endTime,
      peopleCount,
      phoneNumber,
      menuIds,
    } = createReservationForm;

    // 식당 체크
    const restaurant = await this.restaurantRepository.findOne({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      throw new NotFoundException('NOT_FOUND_RESTAURANT');
    }

    // 고객 체크
    const customer = await this.customerRepository.findOne({
      where: { id: customerId },
    });

    if (!customer) {
      throw new NotFoundException('NOT_FOUND_CUSTOMER');
    }

    // 중복 예약 체크
    await this._checkDuplicateReservation(
      restaurantId,
      new Date(startTime),
      new Date(endTime),
    );

    // 메뉴 체크
    const menus = await this.menuRepository.find({
      where: {
        id: In(menuIds),
        restaurant: { id: restaurantId },
      },
    });

    if (menus.length !== menuIds.length) {
      throw new BadRequestException('INVALID_MENU_SELECTION');
    }

    // 예약 생성
    const reservation = this.reservationRepository.create({
      restaurant,
      customer,
      startTime: startTime,
      endTime: endTime,
      phoneNumber: phoneNumber,
      peopleCount: peopleCount,
      menuIds: menuIds,
    });

    const saved = await this.reservationRepository.save(reservation);

    return CreateReservationDto.of({
      reservationId: saved.id,
      customerName: customer.name,
      restaurantName: restaurant.name,
      startTime: saved.startTime,
      endTime: saved.endTime,
      phoneNumber: saved.phoneNumber,
      peopleCount: saved.peopleCount,
      menus: MenuDto.fromEntities(menus),
    });
  }

  /**
   * 예약 조회 - 고객
   */
  async getReservationsByCustomer(
    customerId: number,
    filter?: GetReservationForm,
  ): Promise<GetReservationDto[]> {
    const qb = this.reservationRepository
      .createQueryBuilder('reservation')
      .leftJoinAndSelect('reservation.restaurant', 'restaurant')
      .leftJoinAndSelect('reservation.customer', 'customer')
      .where('reservation.customerId=:customerId', { customerId });

    // 조건이 있을때 필터
    if (filter) {
      await this._applyFilterConditions(qb, filter);
    }

    const reservations = await qb.getMany();
    return this._buildReservationDtos(reservations);
  }

  /**
   * 예약 조회 - 식당
   */
  async getReservationsByRestaurant(
    restaurantId: number,
    filter?: GetReservationForm,
  ): Promise<GetReservationDto[]> {
    const qb = this.reservationRepository
      .createQueryBuilder('reservation')
      .leftJoinAndSelect('reservation.restaurant', 'restaurant')
      .leftJoinAndSelect('reservation.customer', 'customer')
      .where('reservation.restaurantId=:restaurantId', { restaurantId });

    // 조건이 있을때 필터
    if (filter) {
      await this._applyFilterConditions(qb, filter);
    }

    const reservations = await qb.getMany();
    return this._buildReservationDtos(reservations);
  }

  /**
   * 예약 수정 - 고객
   */
  async updateReservation(
    reservationId: number,
    customerId: number,
    updateReservationForm: UpdateReservationForm,
  ): Promise<UpdateReservationDto> {
    const reservation = await this.reservationRepository.findOne({
      where: { id: reservationId },
      relations: ['customer', 'restaurant'],
    });

    if (!reservation) {
      throw new BadRequestException('NOT_FOUND_RESERVATION');
    }

    if (reservation.customer.id !== customerId) {
      throw new BadRequestException('FORBIDDEN_CUSTOMER');
    }

    const { peopleCount, menuIds } = updateReservationForm;

    let menus: Menu[] = [];

    // 메뉴 수정
    if (menuIds) {
      menus = await this.menuRepository.find({ where: { id: In(menuIds) } });

      if (menus.length !== menuIds.length) {
        throw new BadRequestException('INVALID_MENU_SELECTION');
      }
      reservation.menuIds = menuIds;
    }

    // 예약 인원 수정
    reservation.peopleCount = peopleCount ?? reservation.peopleCount;

    const updatedReservation = await this.reservationRepository.save(
      reservation,
    );

    return UpdateReservationDto.of({
      reservationId: updatedReservation.id,
      customerName: reservation.customer.name,
      restaurantName: reservation.restaurant.name,
      startTime: updatedReservation.startTime,
      endTime: updatedReservation.endTime,
      phoneNumber: updatedReservation.phoneNumber,
      peopleCount: updatedReservation.peopleCount,
      menus: MenuDto.fromEntities(menus.length ? menus : []),
    });
  }

  /**
   * 예약 취소 (삭제) - 고객
   */
  async deleteReservation(
    reservationId: number,
    customerId: number,
  ): Promise<void> {
    const reservation = await this.reservationRepository.findOne({
      where: { id: reservationId },
      relations: ['customer'],
    });

    if (!reservation) {
      throw new NotFoundException('NOT_FOUND_RESERVATION');
    }

    if (reservation.customer.id !== customerId) {
      throw new BadRequestException('FORBIDDEN_CUSTOMER');
    }

    await this.reservationRepository.delete(reservationId);
  }

  /**
   * 예약 시간 겹치는지 체크
   */
  private async _checkDuplicateReservation(
    restaurantId: number,
    startTime: Date,
    endTime: Date,
  ): Promise<void> {
    const where: FindOptionsWhere<Reservation> = {
      restaurant: { id: restaurantId },
      startTime: LessThan(endTime),
      endTime: MoreThan(startTime),
    };

    const reservation = await this.reservationRepository.findOne({
      where,
    });

    if (reservation) {
      throw new BadRequestException('RESERVATION_ALREADY_EXISTS');
    }
  }

  /**
   * 예약 조회 공통 필터 조건
   */
  private async _applyFilterConditions(
    qb: SelectQueryBuilder<Reservation>,
    filter: GetReservationForm,
  ) {
    if (filter.phone) {
      qb.andWhere('reservation.phoneNumber LIKE :phone', {
        phone: `%${filter.phone}%`,
      });
    }

    if (filter.date) {
      qb.andWhere(
        'DATE(reservation.createdAt)=:createdDate',
        { createdDate: filter.date }, // ex: 'YYYY-MM-DD'
      );
    }

    if (filter.minPeople) {
      qb.andWhere('reservation.peopleCount>=:minPeople', {
        minPeople: filter.minPeople,
      });
    }

    if (filter.menuId) {
      qb.andWhere('FIND_IN_SET(:menuId, reservation.menuIds)', {
        menuId: String(filter.menuId),
      });
    }
  }

  /**
   * 공통 dto 변환
   */
  private async _buildReservationDtos(
    reservations: Reservation[],
  ): Promise<GetReservationDto[]> {
    // 모든 예약 menuIds 배열 하나로 만들고 중복 제거
    const uniqueMenuIds = [
      ...new Set(reservations.flatMap((r) => r.menuIds ?? [])),
    ];

    // 중복 제거 메뉴가 있으면 중복 제거된 메뉴 아이디들로 조회
    const allMenus = uniqueMenuIds.length
      ? await this.menuRepository.findBy({ id: In(uniqueMenuIds) })
      : [];

    // map 으로 캐싱
    const menuMap = new Map<number, Menu>(
      allMenus.map((menu) => [menu.id, menu]),
    );

    // reservations을 map 돌면서 GetReservationDto 로 변환
    return reservations.map((reservation) => {
      // 예약에 저장된 메뉴 아이디들 map 에서 찾아서 실제 메뉴 객체 배열로 변환
      const menus = (reservation.menuIds ?? [])
        .map((id) => menuMap.get(Number(id))) // id 로 메뉴 조회
        .filter((menu): menu is Menu => !!menu); // null undefined 제거

      const menuDtos = menus.map((menu) => MenuDto.of(menu));

      return GetReservationDto.of({
        reservationId: reservation.id,
        customerName: reservation.customer.name,
        restaurantName: reservation.restaurant.name,
        startTime: reservation.startTime,
        endTime: reservation.endTime,
        phoneNumber: reservation.phoneNumber,
        peopleCount: reservation.peopleCount,
        menus: menuDtos,
      });
    });
  }
}
