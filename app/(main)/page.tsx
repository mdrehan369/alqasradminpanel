import { CircleHelp } from "lucide-react";
import { getFormattedCurrDateAndTime } from "@/lib/utils";
import HeroProductTable from "@/components/tables/heroProduct";
import HeroCategoryTable from "@/components/tables/heroCategory";
import Stats from "@/components/tables/stats";

export default async function Page() {
    return (
        <div className="w-full bg-[#f7f6f2] text-[#20221f]">
            <main>
                <div className="mx-auto md:px-10 md:py-11">
                    <div className="mb-9 flex flex-col justify-between gap-5 md:flex-row md:items-end">
                        <div>
                            <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.2em] text-[#ac8954]">
                                {getFormattedCurrDateAndTime()}
                            </p>
                            <h1 className="font-serif text-4xl tracking-[-0.03em] md:text-[44px]">
                                Good morning, Admin
                            </h1>
                            <p className="mt-2 text-sm text-[#85867f]">
                                Here&apos;s what&apos;s happening with your
                                fragrance house today.
                            </p>
                        </div>
                    </div>
                    <Stats />
                    <div className="grid gap-6 xl:grid-cols-[1.55fr_1fr]">
                        <HeroProductTable />
                        <HeroCategoryTable />
                    </div>
                    <div className="mt-6 flex items-center gap-2 text-[11px] text-[#9a9b94]">
                        <CircleHelp size={14} />
                        <span>Need help managing your catalog?</span>
                        <button className="text-[#9b7442] hover:underline">
                            Read the guide
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
