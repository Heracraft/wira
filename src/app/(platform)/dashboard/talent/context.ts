"use client";

import { createContext } from "react";

import type {TalentProfile} from "@/types"

export const TalentProfileContext = createContext<null | TalentProfile>(null);
