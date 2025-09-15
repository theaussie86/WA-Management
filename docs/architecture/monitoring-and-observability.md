# Monitoring and Observability

## Monitoring Stack
- **Frontend Monitoring:** Vercel Analytics + Web Vitals tracking
- **Backend Monitoring:** Vercel Function Logs + Supabase Dashboard
- **Error Tracking:** Native error boundaries + Supabase error logs
- **Performance Monitoring:** Next.js built-in performance monitoring + Supabase query performance

## Key Metrics

**Frontend Metrics:**
- Core Web Vitals (LCP < 2.5s, FID < 100ms, CLS < 0.1)
- JavaScript errors per session
- API response times for content operations
- User interaction success rates (approval/rejection actions)

**Backend Metrics:**
- API request rate (requests per minute)
- Error rate (< 1% target)
- Response time (95th percentile < 500ms)
- Database query performance and connection pool usage

**Business Metrics:**
- Content pipeline throughput (items processed per day)
- Human approval rates by content type
- AI service costs and usage patterns
- LinkedIn publishing success rates

---
