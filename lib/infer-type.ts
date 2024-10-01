import type {
    BuildQueryResult,
    DBQueryConfig,
    ExtractTablesWithRelations,
} from "drizzle-orm";
import * as schema from "@/server/schema";

type Schema = typeof schema;
type TSchema = ExtractTablesWithRelations<Schema>;

export type IncludeRelation<TableName extends keyof TSchema> = DBQueryConfig<
    "one" | "many",
    boolean,
    TSchema,
    TSchema[TableName]
>["with"];

export type InferResultType<
    TableName extends keyof TSchema,
    With extends IncludeRelation<TableName> | undefined = undefined
> = BuildQueryResult<
    TSchema,
    TSchema[TableName],
    {
        with: With
    }
>;

export type VariantsWithImagesTags = InferResultType<
    "productVariant",
    {
        variantImages: true;
        variantTags: true;
    }
>;

export type ProductsWithVariants = InferResultType<
    "products",
    {
        productVariant: true;
    }
>;

export type VariantsWithProduct = InferResultType<
    "productVariant",
    {
        variantImages: true;
        variantTags: true;
        product: true;
    }
>;

// export type Products = InferSelectModel<typeof products>;