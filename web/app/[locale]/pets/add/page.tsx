// web/app/[locale]/pets/add/page.tsx
import { type Locale } from "@/i18n-config";
import CreatePetCard from "@/components/pets/create-pet-card"; // Import the form card
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AddPetPageProps {
  params: { locale: Locale };
}

export default function AddPetPage({ params }: AddPetPageProps) {
  const { locale } = params;

  return (
    <div className="container-custom max-w-2xl mx-auto py-8">
        <div className="mb-6">
             <Button variant="ghost" size="sm" asChild className="mb-4">
                <Link href={`/${locale}/profile`}> {/* Link back to profile */}
                   <ArrowLeft className="h-4 w-4 mr-2"/>
                   返回個人資料
                </Link>
             </Button>
             <h1 className="text-2xl font-bold">新增寵物</h1>
             <p className="text-muted-foreground">填寫您的新寵物夥伴的資訊。</p>
        </div>

      <CreatePetCard locale={locale} />
    </div>
  );
}