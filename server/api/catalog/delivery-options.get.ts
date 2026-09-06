import type { DeliveryOption } from "#shared/types";
import { DELIVERY_OPTIONS } from "~~/server/utils/catalog";

/** GET /api/catalog/delivery-options */
export default defineEventHandler((): DeliveryOption[] => DELIVERY_OPTIONS);
