CREATE TABLE "badges" (
	"badge_id" serial PRIMARY KEY NOT NULL,
	"badge_name" varchar(50) NOT NULL,
	"description" varchar(255) NOT NULL,
	"criteria" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"category_id" serial PRIMARY KEY NOT NULL,
	"category_name" varchar(100) NOT NULL,
	"description" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "expert_application_categories" (
	"application_id" integer NOT NULL,
	"category_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "expert_application_certificates" (
	"certificate_id" serial PRIMARY KEY NOT NULL,
	"application_id" integer NOT NULL,
	"file_url" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "expert_applications" (
	"application_id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"full_name" varchar(100) NOT NULL,
	"github_link" varchar(255),
	"about_self" text,
	"reason" text,
	"additional_info" text,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "replies" (
	"reply_id" serial PRIMARY KEY NOT NULL,
	"subthread_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subthreads" (
	"subthread_id" serial PRIMARY KEY NOT NULL,
	"thread_id" integer NOT NULL,
	"user_id" integer,
	"content" text NOT NULL,
	"is_ai_generated" boolean DEFAULT false NOT NULL,
	"up_vote" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"subscription_id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"subscription_type" varchar(10) NOT NULL,
	"start_date" timestamp DEFAULT now() NOT NULL,
	"end_date" timestamp NOT NULL,
	"status" varchar(10) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subthread_upvotes" (
	"subthread_upvote_id" serial PRIMARY KEY NOT NULL,
	"subthread_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_subthread_user" UNIQUE("subthread_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "threadcategories" (
	"thread_id" integer,
	"category_id" integer
);
--> statement-breakpoint
CREATE TABLE "thread_upvotes" (
	"thread_upvote_id" serial PRIMARY KEY NOT NULL,
	"thread_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_thread_user" UNIQUE("thread_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "threads" (
	"thread_id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"thread_type" varchar(10) NOT NULL,
	"up_vote" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "userbadges" (
	"user_id" serial PRIMARY KEY NOT NULL,
	"badge_id" serial NOT NULL,
	"awarded_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "userprofiles" (
	"user_id" serial PRIMARY KEY NOT NULL,
	"profile_picture" varchar(255),
	"about_me" varchar(255),
	"banner" varchar(255),
	"status" varchar(50),
	"personal_website" varchar(255),
	"github" varchar(255),
	"linkedin" varchar(255),
	"total_replies_posted" integer,
	"total_badges_posted" integer,
	"total_threads_posted" integer
);
--> statement-breakpoint
CREATE TABLE "users" (
	"user_id" serial PRIMARY KEY NOT NULL,
	"username" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255),
	"is_expert" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "expert_application_categories" ADD CONSTRAINT "expert_application_categories_application_id_expert_applications_application_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."expert_applications"("application_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expert_application_categories" ADD CONSTRAINT "expert_application_categories_category_id_categories_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("category_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expert_application_certificates" ADD CONSTRAINT "expert_application_certificates_application_id_expert_applications_application_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."expert_applications"("application_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expert_applications" ADD CONSTRAINT "expert_applications_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "replies" ADD CONSTRAINT "replies_subthread_id_subthreads_subthread_id_fk" FOREIGN KEY ("subthread_id") REFERENCES "public"."subthreads"("subthread_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "replies" ADD CONSTRAINT "replies_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subthreads" ADD CONSTRAINT "subthreads_thread_id_threads_thread_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."threads"("thread_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subthreads" ADD CONSTRAINT "subthreads_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subthread_upvotes" ADD CONSTRAINT "subthread_upvotes_subthread_id_subthreads_subthread_id_fk" FOREIGN KEY ("subthread_id") REFERENCES "public"."subthreads"("subthread_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subthread_upvotes" ADD CONSTRAINT "subthread_upvotes_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "threadcategories" ADD CONSTRAINT "threadcategories_thread_id_threads_thread_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."threads"("thread_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "threadcategories" ADD CONSTRAINT "threadcategories_category_id_categories_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("category_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "thread_upvotes" ADD CONSTRAINT "thread_upvotes_thread_id_threads_thread_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."threads"("thread_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "thread_upvotes" ADD CONSTRAINT "thread_upvotes_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "threads" ADD CONSTRAINT "threads_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "userbadges" ADD CONSTRAINT "userbadges_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "userbadges" ADD CONSTRAINT "userbadges_badge_id_badges_badge_id_fk" FOREIGN KEY ("badge_id") REFERENCES "public"."badges"("badge_id") ON DELETE no action ON UPDATE no action;