"use client";

import { createContext } from "react";

import type {CompanyProfileRow} from "@/db/schema"

export const CompanyProfileContext = createContext<null | CompanyProfileRow>(null);
