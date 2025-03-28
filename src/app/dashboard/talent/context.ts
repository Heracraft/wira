"use client";

import { createContext } from "react";

import type {TalentProfile} from "@/types/dashboard"

export const TalentProfileContext = createContext<null | TalentProfile>(null);
