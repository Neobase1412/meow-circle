import Link from "next/link"
import Image from "next/image"
import { type Locale, dictionary } from "@/i18n-config"
import { Card, CardContent } from "@/components/ui/card"
import RegisterForm from "@/components/auth/register-form"

export default function RegisterPage({ params: { locale } }: { params: { locale: Locale } }) {
  const t = dictionary[locale]

  return (
    <div className="container-custom flex items-center justify-center min-h-[calc(100vh-16rem)] py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image src="/images/logo.png" alt="喵圈 Meow Circle" width={64} height={64} className="rounded-full" />
          </div>
          <h1 className="text-2xl font-bold">{t["join-meow-universe"]}</h1>
          <p className="text-primary/70 mt-2">創建您的帳號，加入喵宇宙大家庭</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <RegisterForm locale={locale} />

            <div className="mt-6 text-center">
              <p className="text-primary/70">
                {t["has-account"]}{" "}
                <Link href={`/${locale}/login`} className="text-primary font-medium hover:underline">
                  {t["sign-in"]}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
