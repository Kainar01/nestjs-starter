SELECT distinct "u"."id" as user_id
FROM "user_schedule" "us" INNER JOIN "user" "u" ON "u"."id" = "us"."user_id" INNER JOIN "schedule" "s" ON "s"."id" = "us"."schedule_id"
WHERE "s"."hour" = '19' AND "us"."last_cron" IS NULL OR "us"."last_cron" < '2022-09-04T14:00:00.000Z'

