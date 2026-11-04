CREATE TABLE "job" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255),
	"description" text,
	"requirements" text,
	"location" varchar(255),
	"type" varchar(50),
	"salary" varchar(100),
	"posted_at" timestamp DEFAULT now(),
	"is_active" boolean DEFAULT true
);
