using Polly;
using Polly.Retry;

namespace KEGEstation.Presentation.Middlewares;

public class RetryMiddleware : IMiddleware
{
    private readonly ILogger<RetryMiddleware> _logger;
    private readonly AsyncRetryPolicy _policy;

    public RetryMiddleware(ILogger<RetryMiddleware> logger)
    {
        _logger = logger;
        _policy = Policy
            .Handle<Exception>()
            .WaitAndRetryAsync(3, retryAttempt =>
                    TimeSpan.FromMilliseconds(1000 * Math.Pow(2, retryAttempt)),
                onRetry: (outcome, timespan, retryAttempt, _) =>
                {
                    logger.LogError($"Request failed with {outcome.Message}. Waiting {timespan} before next retry. Retry attempt {retryAttempt}.");
                });
    }

    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        await _policy.ExecuteAsync(() => next(context));
    }
}