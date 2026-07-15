import { useEffect } from 'react'
import addTokenScreenshot from '../../api-get-image/Screenshot - 2026-07-15 15.08.45.png'
import image2TokenScreenshot from '../../api-get-image/Screenshot - 2026-07-15 15.11.20.png'
import bananaTokenScreenshot from '../../api-get-image/Screenshot - 2026-07-15 15.13.37.png'
import copyTokenScreenshot from '../../api-get-image/Screenshot - 2026-07-15 15.14.04.png'
import { API_KEY_REGISTRATION_URL } from '../lib/apiKeyGuide'

const steps = [
  {
    id: 'open-token-page',
    eyebrow: '准备工作',
    title: '进入 API 令牌页面',
    description: '注册并登录 Cursor API 控制台，在左侧导航栏进入“API 令牌”，然后点击“添加令牌”。',
    image: addTokenScreenshot,
    alt: '在 Cursor API 控制台中进入 API 令牌页面并点击添加令牌',
    tips: ['先完成账号注册与登录', '在左侧选择“API 令牌”', '点击页面上方的“添加令牌”'],
  },
  {
    id: 'create-image2-token',
    eyebrow: '令牌一',
    title: '创建 gpt-image-2 令牌',
    description: '这枚令牌专门用于项目中的 OpenAI / gpt-image-2 配置。关闭智能路由后，手动选择截图所示的三个分组。',
    image: image2TokenScreenshot,
    alt: '创建 gpt-image-2 令牌并选择 Codex专属、default、官转分组',
    tips: ['名称填写“gpt-image-2”', '智能路由保持关闭', '依次选择“Codex专属”“default”“官转”', '点击“提交”创建令牌'],
  },
  {
    id: 'create-banana-token',
    eyebrow: '令牌二',
    title: '创建 nano-banana-2 令牌',
    description: '再创建一枚独立令牌，供项目中的 Nano Banana 配置使用。不要与 gpt-image-2 共用同一枚令牌。',
    image: bananaTokenScreenshot,
    alt: '创建 nano-banana-2 令牌并选择特价banana、优质gemini、官转gemini分组',
    tips: ['名称填写“nano-banana-2”', '智能路由保持关闭', '依次选择“特价banana”“优质gemini”“官转gemini”', '点击“提交”创建令牌'],
  },
  {
    id: 'copy-api-keys',
    eyebrow: '完成配置',
    title: '分别复制两枚 API Key',
    description: '回到令牌列表，点击每行密钥右侧的复制图标。随后把两枚密钥分别填入本项目对应的 API 配置。',
    image: copyTokenScreenshot,
    alt: '从 API 令牌列表分别复制 nano-banana-2 和 gpt-image-2 的密钥',
    tips: ['gpt-image-2 密钥填入项目的 gpt-image-2 配置', 'nano-banana-2 密钥填入项目的 nano-banana-2 配置', '复制时不要包含空格或掩码字符'],
  },
]

function ArrowUpRightIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17 17 7M7 7h10v10" />
    </svg>
  )
}

function ArrowLeftIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m15 18-6-6 6-6" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="m5 12 4 4L19 6" />
    </svg>
  )
}

export default function ApiKeyGuidePage() {
  useEffect(() => {
    const previousTitle = document.title
    document.title = 'API Key 获取教程 | GPT & Banana'
    return () => {
      document.title = previousTitle
    }
  }, [])

  return (
    <div data-selectable-text className="min-h-screen bg-[#f6f8fc] text-gray-900 dark:bg-[#09090b] dark:text-gray-100">
      <header className="sticky top-0 z-30 border-b border-gray-200/70 bg-white/85 backdrop-blur-xl dark:border-white/[0.08] dark:bg-[#09090b]/85">
        <div className="safe-area-x mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-4 py-3">
          <a href={import.meta.env.BASE_URL} className="flex min-w-0 items-center gap-3" aria-label="返回 GPT & Banana">
            <img src={`${import.meta.env.BASE_URL}pwa-icon.svg`} alt="GPT & Banana" className="h-9 w-9 rounded-xl" />
            <div className="min-w-0">
              <div className="truncate text-sm font-bold text-gray-900 dark:text-white">GPT & Banana</div>
              <div className="truncate text-xs text-gray-500 dark:text-gray-400">API Key 获取教程</div>
            </div>
          </a>
          <a
            href={import.meta.env.BASE_URL}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-blue-200 hover:text-blue-600 dark:border-white/[0.1] dark:bg-white/[0.04] dark:text-gray-300 dark:hover:border-blue-400/30 dark:hover:text-blue-300"
          >
            <ArrowLeftIcon />
            返回应用
          </a>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-gray-200/70 bg-white dark:border-white/[0.08] dark:bg-[#0d0d10]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(59,130,246,0.16),transparent_34%),radial-gradient(circle_at_85%_10%,rgba(99,102,241,0.13),transparent_30%)]" />
          <div className="safe-area-x relative mx-auto max-w-6xl py-16 sm:py-24">
            <div className="max-w-3xl">
              <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:border-blue-400/20 dark:bg-blue-500/10 dark:text-blue-300">
                新手指南 · 约 3 分钟
              </span>
              <h1 className="mt-5 text-4xl font-black tracking-tight text-gray-950 sm:text-6xl dark:text-white">
                获取并配置你的
                <span className="block bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">API Key</span>
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-gray-600 sm:text-lg dark:text-gray-300">
                按照下面 4 个步骤，分别创建 gpt-image-2 和 nano-banana-2 令牌，再把它们填入项目对应的 API 配置。
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href={API_KEY_REGISTRATION_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700 active:scale-[0.98]"
                >
                  注册并打开控制台
                  <ArrowUpRightIcon />
                </a>
                <a
                  href="#open-token-page"
                  className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white/70 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-blue-200 hover:text-blue-600 dark:border-white/[0.1] dark:bg-white/[0.04] dark:text-gray-200 dark:hover:border-blue-400/30 dark:hover:text-blue-300"
                >
                  查看图文步骤
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="safe-area-x mx-auto max-w-6xl py-10 sm:py-14">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <a
                key={step.id}
                href={`#${step.id}`}
                className="group rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md dark:border-white/[0.08] dark:bg-white/[0.03] dark:hover:border-blue-400/30"
              >
                <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-sm font-bold text-blue-600 group-hover:bg-blue-600 group-hover:text-white dark:bg-blue-500/10 dark:text-blue-300">
                  {index + 1}
                </div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">{step.title}</div>
              </a>
            ))}
          </div>
        </section>

        <section className="safe-area-x mx-auto max-w-6xl pb-16 sm:pb-24">
          <div className="space-y-8 sm:space-y-12">
            {steps.map((step, index) => (
              <article
                id={step.id}
                key={step.id}
                className="scroll-mt-24 overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-sm dark:border-white/[0.08] dark:bg-white/[0.03]"
              >
                <div className="grid lg:grid-cols-[minmax(0,0.38fr)_minmax(0,0.62fr)]">
                  <div className="flex flex-col justify-center p-6 sm:p-9 lg:p-10">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-sm font-black text-white shadow-lg shadow-blue-500/20">
                        {index + 1}
                      </span>
                      <span className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-300">{step.eyebrow}</span>
                    </div>
                    <h2 className="mt-5 text-2xl font-black tracking-tight text-gray-950 sm:text-3xl dark:text-white">{step.title}</h2>
                    <p className="mt-3 text-sm leading-7 text-gray-600 sm:text-base dark:text-gray-300">{step.description}</p>
                    <ul className="mt-6 space-y-3">
                      {step.tips.map((tip) => (
                        <li key={tip} className="flex items-start gap-2 text-sm leading-6 text-gray-700 dark:text-gray-300">
                          <CheckIcon />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                    {index === 0 && (
                      <a
                        href={API_KEY_REGISTRATION_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-7 inline-flex w-fit items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600 dark:bg-white dark:text-gray-900 dark:hover:bg-blue-400"
                      >
                        前往创建令牌
                        <ArrowUpRightIcon />
                      </a>
                    )}
                  </div>
                  <a
                    href={step.image}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/image flex min-h-64 items-center justify-center border-t border-gray-200/80 bg-gray-50/80 p-3 sm:p-5 lg:border-l lg:border-t-0 dark:border-white/[0.08] dark:bg-black/20"
                    title="点击查看原图"
                  >
                    <img
                      src={step.image}
                      alt={step.alt}
                      loading={index === 0 ? 'eager' : 'lazy'}
                      className="max-h-[760px] w-full rounded-2xl object-contain shadow-sm ring-1 ring-black/5 transition group-hover/image:shadow-lg dark:ring-white/10"
                    />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-amber-200/70 bg-amber-50/80 dark:border-amber-400/10 dark:bg-amber-500/[0.06]">
          <div className="safe-area-x mx-auto max-w-6xl py-8 sm:py-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300">!</div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">请妥善保管 API Key</h2>
                <p className="mt-2 max-w-3xl text-sm leading-7 text-gray-600 dark:text-gray-300">
                  不要把完整密钥发送给他人，也不要提交到 GitHub、Issue 或公开截图中。如果怀疑密钥泄露，请立即在控制台禁用旧令牌并重新创建。
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="safe-area-x mx-auto max-w-6xl py-14 text-center sm:py-20">
          <h2 className="text-2xl font-black text-gray-950 sm:text-3xl dark:text-white">准备好开始创作了吗？</h2>
          <p className="mt-3 text-sm text-gray-600 sm:text-base dark:text-gray-300">复制密钥后返回应用，在“设置 → API 配置”中完成最后一步。</p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href={import.meta.env.BASE_URL}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700"
            >
              <ArrowLeftIcon />
              返回应用填写密钥
            </a>
            <a
              href={API_KEY_REGISTRATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-blue-200 hover:text-blue-600 dark:border-white/[0.1] dark:bg-white/[0.04] dark:text-gray-200"
            >
              打开 API 控制台
              <ArrowUpRightIcon />
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-200/80 bg-white py-6 text-center text-xs text-gray-500 dark:border-white/[0.08] dark:bg-[#0d0d10] dark:text-gray-400">
        GPT & Banana · API Key 获取教程
      </footer>
    </div>
  )
}
