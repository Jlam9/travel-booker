import { BookingService } from 'src/service/booking/booking.service';
import { Repository } from 'typeorm';
import { Booking } from 'src/model/booking/booking.entity';
import { Destination } from 'src/model/destination/destination.entity';
import { User } from 'src/model/account/user.entity';
import { BookingStatusType } from 'src/type/booking/booking-status.type';
import { MessageCodes } from 'src/config/exception/internal-message-code';
import { CustomError } from 'src/config/exception/custom.error';

describe('BookingService.createBooking', () => {
  let service: BookingService;

  const mockBookingRepo = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockDestinationRepo = {
    findOne: jest.fn(),
  };

  const mockUserRepo = {
    findOne: jest.fn(),
  };

  beforeEach(() => {
    service = new BookingService(
      mockBookingRepo as unknown as Repository<Booking>,
      mockDestinationRepo as unknown as Repository<Destination>,
      mockUserRepo as unknown as Repository<User>,
    );
  });

  it('Debe fallar si destino está inactivo', async () => {
    mockDestinationRepo.findOne.mockResolvedValue({
      id: 1,
      isActive: false,
    });

    await expect(
      service.createBooking(
        {
          customerName: 'Test',
          customerEmail: 'test@mail.com',
          destinationId: 1,
          travelDate: '2025-01-01',
        },
        'creator@mail.com',
      ),
    ).rejects.toThrow(CustomError);
  });

  it('Debe crear booking correctamente con destino activo', async () => {
    mockDestinationRepo.findOne.mockResolvedValue({
      id: 1,
      isActive: true,
    });

    mockUserRepo.findOne.mockResolvedValue({
      id: 10,
      email: 'creator@mail.com',
    });

    mockBookingRepo.create.mockReturnValue({
      id: 5,
      customerName: 'Test',
      customerEmail: 'test@mail.com',
      destination: { id: 1 },
      createdByUser: { id: 10 },
      status: BookingStatusType.Pending,
      travelDate: new Date('2025-01-01'),
    });

    mockBookingRepo.save.mockResolvedValue({
      id: 5,
      customerName: 'Test',
      customerEmail: 'test@mail.com',
      destination: { id: 1 },
      createdByUser: { id: 10 },
      status: BookingStatusType.Pending,
      travelDate: new Date('2025-01-01'),
    });

    const result = await service.createBooking(
      {
        customerName: 'Test',
        customerEmail: 'test@mail.com',
        destinationId: 1,
        travelDate: '2025-01-01',
      },
      'creator@mail.com',
    );

    expect(result.id).toBe(5);
    expect(result.status).toBe(BookingStatusType.Pending);
  });
});
