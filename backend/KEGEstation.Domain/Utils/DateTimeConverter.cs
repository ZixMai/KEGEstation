namespace KEGEstation.Domain.Utils;

public static class DateTimeConverter
{
    public static DateTime RemoveTimeZone(DateTime timestamp) =>
        DateTime.SpecifyKind(timestamp, DateTimeKind.Unspecified);
}