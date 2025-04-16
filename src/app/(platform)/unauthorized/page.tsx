import Link from "next/link"

import {Card,CardContent} from "@/components/ui/card"
import {Button} from "@/components/ui/button"

import { cn } from "@/lib/utils"

export default function Page(){
    return (
        <div className="flex flex-1 items-center justify-center">
            <Card className={cn("flex flex-col p-5 items-center")}>
                <h1 className="text-7xl font-bold">401</h1>
                <p className="text-3xl">Unauthorized.</p>
                <p className="text-xl text-muted-foreground max-w-[45ch] my-4">Unauthorized request, your account does not have the necessary clearance</p>
                <Button className="my-2"><Link href={"/dashboard"}>Back to dashboard</Link></Button>
            </Card>
        </div>
        )
}