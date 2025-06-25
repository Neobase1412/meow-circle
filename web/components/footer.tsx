import Link from "next/link"
import { Facebook, Instagram, Youtube, Mail } from "lucide-react"
import { type Locale, dictionary } from "@/i18n-config"

export default function Footer({ locale }: { locale: Locale }) {
  const t = dictionary[locale] || dictionary['zh-TW']

  return (
    <footer className="bg-secondary/30 py-12">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* About Us */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t["about-us"]}</h3>
            <ul className="space-y-2">
              <li>
                <Link href={`/${locale}/about`} className="text-primary/70 hover:text-primary">
                  {t["about-meow-universe"]}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/about#team`} className="text-primary/70 hover:text-primary">
                  {t["team-intro"]}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/about#story`} className="text-primary/70 hover:text-primary">
                  {t["brand-story"]}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/contact`} className="text-primary/70 hover:text-primary">
                  {t["contact-us"]}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/terms`} className="text-primary/70 hover:text-primary">
                  {t["terms-of-service"]}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/privacy`} className="text-primary/70 hover:text-primary">
                  {t["privacy-policy"]}
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t["pet-services"]}</h3>
            <ul className="space-y-2">
              <li>
                <Link href={`/${locale}/pet-life/health`} className="text-primary/70 hover:text-primary">
                  {t["health-management"]}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/pet-life/grooming`} className="text-primary/70 hover:text-primary">
                  {t["grooming-services"]}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/pet-life/boarding`} className="text-primary/70 hover:text-primary">
                  {t["pet-boarding"]}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/community`} className="text-primary/70 hover:text-primary">
                  {t["community-exchange"]}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/shop`} className="text-primary/70 hover:text-primary">
                  {t["featured-shop"]}
                </Link>
              </li>
            </ul>
          </div>

          {/* Beginner Guide */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t["beginner-guide"]}</h3>
            <ul className="space-y-2">
              <li>
                <Link href={`/${locale}/newbie`} className="text-primary/70 hover:text-primary">
                  {t["platform-tutorial"]}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/newbie/nutrition`} className="text-primary/70 hover:text-primary">
                  {t["nutrition-knowledge"]}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/newbie/care`} className="text-primary/70 hover:text-primary">
                  {t["care-guide"]}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/newbie/faq`} className="text-primary/70 hover:text-primary">
                  {t["faq"]}
                </Link>
              </li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t["follow-us"]}</h3>
            <ul className="space-y-4">
              <li>
                <Link href="#" className="flex items-center gap-2 text-primary/70 hover:text-primary">
                  <Facebook className="h-5 w-5" />
                  <span>Facebook</span>
                </Link>
              </li>
              <li>
                <Link href="#" className="flex items-center gap-2 text-primary/70 hover:text-primary">
                  <Instagram className="h-5 w-5" />
                  <span>Instagram</span>
                </Link>
              </li>
              <li>
                <Link href="#" className="flex items-center gap-2 text-primary/70 hover:text-primary">
                  <Youtube className="h-5 w-5" />
                  <span>YouTube</span>
                </Link>
              </li>
              <li>
                <Link href="#" className="flex items-center gap-2 text-primary/70 hover:text-primary">
                  <Mail className="h-5 w-5" />
                  <span>{t["newsletter-subscription"]}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Copyright */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t["copyright"]}</h3>
            <p className="text-primary/70 text-sm mb-2">{t["all-rights-reserved"]}</p>
            <p className="text-primary/70 text-sm mb-2">{t["trademark-notice"]}</p>
            <p className="text-primary/70 text-sm">{t["image-license"]}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
