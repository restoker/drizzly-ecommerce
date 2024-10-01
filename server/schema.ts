// import { sql } from "drizzle-orm";
import { InferSelectModel, relations } from "drizzle-orm";
import {
    timestamp,
    pgTable,
    text,
    primaryKey,
    integer,
    boolean,
    pgEnum,
    real,
    serial,
    // uuid,
} from "drizzle-orm/pg-core"
// import postgres from "postgres"
import type { AdapterAccountType } from "next-auth/adapters"

// export const posts = pgTable('posts', {
//     id: uuid('id').default(sql`gen_random_uuid()`).primaryKey().notNull(),
//     title: text('title').notNull(),
// })
export const RoleEnum = pgEnum("roles", ["user", "admin"]);

export const users = pgTable("user", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text("name"),
    email: text("email").notNull(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: text("image"),
    password: text('password'),
    twoFactorEnabled: boolean("towFactorEnabled").default(false),
    role: RoleEnum("roles").default('user'),
})

export const accounts = pgTable("account",
    {
        userId: text("userId")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        type: text("type").$type<AdapterAccountType>().notNull(),
        provider: text("provider").notNull(),
        providerAccountId: text("providerAccountId").notNull(),
        refresh_token: text("refresh_token"),
        access_token: text("access_token"),
        expires_at: integer("expires_at"),
        token_type: text("token_type"),
        scope: text("scope"),
        id_token: text("id_token"),
        session_state: text("session_state"),
    },
    (account) => ({
        compoundKey: primaryKey({
            columns: [account.provider, account.providerAccountId],
        }),
    })
);

export const emailTokens = pgTable(
    "emailToken",
    {
        id: text("id").notNull().$defaultFn(() => crypto.randomUUID()),
        token: text("token").notNull(),
        expires: timestamp("expires", { mode: "date" }).notNull(),
        email: text('email').notNull(),
    },
    (vt) => ({
        compositePk: primaryKey({
            columns: [vt.id, vt.token],
        }),
    })
)

export const passwordResetTokens = pgTable("passwordResetToken",
    {
        id: text("id").notNull().$defaultFn(() => crypto.randomUUID()),
        token: text("token").notNull(),
        expires: timestamp("expires", { mode: "date" }).notNull(),
        email: text('email').notNull(),
    },
    (vt) => ({
        compositePk: primaryKey({
            columns: [vt.id, vt.token],
        }),
    })
)

export const twoFactorTokens = pgTable("twoFactorToken",
    {
        id: text("id").notNull().$defaultFn(() => crypto.randomUUID()),
        token: text("token").notNull(),
        expires: timestamp("expires", { mode: "date" }).notNull(),
        email: text('email').notNull(),
        userID: text('userID').references(() => users.id, { onDelete: 'cascade' }),
    },
    (vt) => ({
        compositePk: primaryKey({
            columns: [vt.id, vt.token],
        }),
    })
);

export const products = pgTable('products', {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    description: text('description').notNull(),
    title: text('title').notNull(),
    created: timestamp('created').defaultNow(),
    price: real('price').notNull(),
    // createdAt: timestamp("created_at"),
})

export const productVariant = pgTable('productVariant', {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    color: text('color').notNull(),
    productType: text('productType').notNull(),
    updated: timestamp('updated').defaultNow(),
    productId: text("productId").$defaultFn(() => crypto.randomUUID()).notNull().references(() => products.id, { onDelete: 'cascade' }),
});

export const variantImages = pgTable('variantImages', {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    url: text('url').notNull(),
    size: real('size').notNull(),
    name: text('name').notNull(),
    order: real('order').notNull(),
    variantId: text("variantId").$defaultFn(() => crypto.randomUUID()).notNull()
        .references(() => productVariant.id, { onDelete: 'cascade' })
});

export const variantTags = pgTable('variantTags', {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    tag: text('tag').notNull(),
    variantId: text("variantId").$defaultFn(() => crypto.randomUUID()).notNull()
        .references(() => productVariant.id, { onDelete: 'cascade' })
});

export const productRelations = relations(products, ({ one, many }) => ({
    productVariant: many(productVariant, { relationName: 'productVariant' })
}));

export const productVariantsRelations = relations(productVariant, ({ one, many }) => ({
    products: one(products, {
        fields: [productVariant.productId],
        references: [products.id],
        relationName: "productVariants"
    }),
    variantImages: many(variantImages, { relationName: 'variantImages' }),
    variantTags: many(variantTags, { relationName: 'variantTags' }),
}));


export const variantImagesRelations = relations(variantImages, ({ one, many }) => ({
    productVariant: one(productVariant, {
        fields: [variantImages.variantId],
        references: [productVariant.id],
        relationName: 'variantImages',
    })
}));


export const variantTagsRelations = relations(variantTags, ({ one, many }) => ({
    productVariant: one(productVariant, {
        fields: [variantTags.variantId],
        references: [productVariant.id],
        relationName: 'variantTags'
    })
}));
