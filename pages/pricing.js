import { readFileSync } from 'fs';
import { join } from 'path';
import Head from 'next/head';

export default function Pricing({ htmlContent }) {
  // 提取 HTML 內容
  const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const headMatch = htmlContent.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  
  const bodyContent = bodyMatch ? bodyMatch[1] : htmlContent;
  const headContent = headMatch ? headMatch[1] : '';
  
  return (
    <>
      <Head>
        <title>GenFeer.ai - 訂閱方案</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <div dangerouslySetInnerHTML={{ __html: headContent }} />
      </Head>
      <div dangerouslySetInnerHTML={{ __html: bodyContent }} />
    </>
  );
}

export async function getStaticProps() {
  const htmlContent = readFileSync(join(process.cwd(), 'public', 'pricing.html'), 'utf8');
  
  return {
    props: {
      htmlContent,
    },
  };
}
