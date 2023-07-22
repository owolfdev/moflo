import fs from "fs"
import path from "path"
import React from "react"
import matter from "gray-matter"
import { MDXRemote } from "next-mdx-remote"
import { serialize } from "next-mdx-remote/serialize"

// interface DocumentationProps {
//   mdxSource: IRenderToString;
// }

const Documentation = () => {
  const getMDXSource = async () => {
    const filePath = path.join(process.cwd(), "content", "documentation.mdx")
    const fileContents = fs.readFileSync(filePath, "utf8")
    const { content } = matter(fileContents)
    const mdxSource = await serialize(content)
    return mdxSource
  }

  const mdxSource = getMDXSource()

  return (
    <section className="container grid items-center gap-6 pt-6 pb-8 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Documentation
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          Moflo is an open-source expense tracking app built with Next.js and
          Supabase. It's designed to be easy to use and easy to deploy.
        </p>
        {/* <MDXRemote {...mdxSource} /> */}
      </div>
    </section>
  )
}

// export async function getStaticProps() {

//   return { props: { mdxSource } }
// }

export default Documentation
