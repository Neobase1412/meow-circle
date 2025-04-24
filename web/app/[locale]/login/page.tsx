import Link from "next/link"
import Image from "next/image"
import { type Locale, dictionary } from "@/i18n-config"
import { Card, CardContent } from "@/components/ui/card"
import LoginForm from "@/components/auth/login-form"

export default function LoginPage({ params: { locale } }: { params: { locale: Locale } }) {
  const t = dictionary[locale]

  return (
    <div className="container-custom flex items-center justify-center min-h-[calc(100vh-16rem)] py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image src="/images/logo.png" alt="喵圈 Meow Circle" width={64} height={64} className="rounded-full" />
          </div>
          <h1 className="text-2xl font-bold">{t["welcome-back"]}</h1>
          <p className="text-primary/70 mt-2">登入您的帳號，開始探索喵宇宙</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <LoginForm locale={locale} />

            <div className="mt-6 text-center">
              <p className="text-primary/70">
                {t["no-account"]}{" "}
                <Link href={`/${locale}/register`} className="text-primary font-medium hover:underline">
                  {t["sign-up"]}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
