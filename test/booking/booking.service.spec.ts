import { BookingService } from "src/service/booking/booking.service";
import { MessageCodes } from "src/config/exception/internal-message-code";
import { CustomError } from "src/config/exception/custom.error";
import { BookingStatusType } from "src/type/booking/booking-status.type";

describe("BookingService - Crear Booking", () => {

  const mockBookingRepo = {
    create: jest.fn(),
    save: jest.fn()
  };

  const mockDestinationRepo = {
    findOne: jest.fn()
  };

  const mockUserRepo = {
    findOne: jest.fn()
  };

  const service = new BookingService(
    mockBookingRepo as any,
    mockDestinationRepo as any,
    mockUserRepo as any
  );

  const dto = {
    customerName: "John Doe",
    customerEmail: "john@example.com",
    destinationId: 10,
    travelDate: "2025-05-01T00:00:00.000Z"
  };

  it("Debe lanzar error si el destino no existe", async () => {

    mockDestinationRepo.findOne.mockResolvedValue(null);

    await expect(
      service.createBooking(dto, "agent@example.com")
    ).rejects.toThrow(CustomError);

    await expect(
      service.createBooking(dto, "agent@example.com")
    ).rejects.toMatchObject({
      messageCode: MessageCodes.DestinationNotFound
    });
  });

  it("Debe lanzar error si el destino está inactivo", async () => {

    mockDestinationRepo.findOne.mockResolvedValue({ id: 10, isActive: false });

    await expect(
      service.createBooking(dto, "agent@example.com")
    ).rejects.toMatchObject({
      messageCode: MessageCodes.DestinationInactive
    });
  });

  it("Debe crear booking correctamente si todo es válido", async () => {

    mockDestinationRepo.findOne.mockResolvedValue({ id: 10, isActive: true });

    mockUserRepo.findOne.mockResolvedValue({ id: 99, email: "agent@example.com" });

    mockBookingRepo.create.mockReturnValue({
      id: 1,
      ...dto,
      status: BookingStatusType.Pending,
      createdByUser: { id: 99 }
    });

    mockBookingRepo.save.mockResolvedValue({
      id: 1,
      customerName: dto.customerName,
      customerEmail: dto.customerEmail,
      destination: { id: 10 },
      travelDate: new Date(dto.travelDate),
      createdByUser: { id: 99 },
      status: BookingStatusType.Pending
    });

    const result = await service.createBooking(dto, "agent@example.com");

    expect(result.id).toBe(1);
    expect(result.status).toBe(BookingStatusType.Pending);
    expect(result.destinationId).toBe(10);
  });

});
