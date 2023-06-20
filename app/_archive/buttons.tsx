import Link from "next/link"

import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"

;<div className="flex gap-4">
  <Link
    href={siteConfig.links.docs}
    target="_blank"
    rel="noreferrer"
    className={buttonVariants()}
  >
    Documentation
  </Link>
  <Link
    target="_blank"
    rel="noreferrer"
    href={siteConfig.links.github}
    className={buttonVariants({ variant: "outline" })}
  >
    GitHub
  </Link>
</div>
