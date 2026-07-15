import Select from '../Select'
import ButtonTooltip from './buttonTooltip'

export type ImageSizeMode = 'auto' | 'ratio' | 'resolution'

interface HintTooltipState {
  visible: boolean
  show: () => void
  hide: () => void
  clearTimer: () => void
  startTouch: () => void
}

const selectClass = 'px-3 py-1.5 rounded-xl border border-gray-200/60 dark:border-white/[0.08] bg-white/50 dark:bg-white/[0.03] hover:bg-white dark:hover:bg-white/[0.06] text-xs transition-all duration-200 shadow-sm'
const inputClass = 'min-w-0 w-full px-3 py-1.5 rounded-xl border border-gray-200/60 dark:border-white/[0.08] bg-white/50 dark:bg-white/[0.03] focus:outline-none text-xs transition-all duration-200 shadow-sm'

export default function InputParamsPanel({
  layout,
  apiProfileId,
  apiProfileOptions,
  onApiProfileChange,
  isNanoBanana,
  bananaQuality,
  onBananaQualityChange,
  sizeMode,
  onSizeModeChange,
  allowAuto,
  allowResolution,
  sizeTier,
  onSizeTierChange,
  sizeTierOptions,
  sizeRatio,
  onSizeRatioChange,
  sizeRatioOptions,
  customWidth,
  customHeight,
  onCustomWidthChange,
  onCustomHeightChange,
  onCustomSizeCommit,
  agentAutoImageCount,
  outputImageLimit,
  nInput,
  setNInputFocused,
  commitN,
  handleNInputChange,
  handleNLimitIncreaseAttempt,
  showAgentNHint,
  hideNLimitHint,
  startAgentNHintTouch,
  clearAgentNHintTouchTimer,
  nLimitHint,
  nLimitHintText,
  streamConcurrentByN,
  streamConcurrentHint,
}: {
  layout: 'desktop' | 'mobile'
  apiProfileId: string
  apiProfileOptions: Array<{ label: string; value: string }>
  onApiProfileChange: (profileId: string) => void
  isNanoBanana: boolean
  bananaQuality: 'standard' | 'high'
  onBananaQualityChange: (quality: 'standard' | 'high') => void
  sizeMode: ImageSizeMode
  onSizeModeChange: (mode: ImageSizeMode) => void
  allowAuto: boolean
  allowResolution: boolean
  sizeTier: string
  onSizeTierChange: (tier: string) => void
  sizeTierOptions: string[]
  sizeRatio: string
  onSizeRatioChange: (ratio: string) => void
  sizeRatioOptions: string[]
  customWidth: string
  customHeight: string
  onCustomWidthChange: (value: string) => void
  onCustomHeightChange: (value: string) => void
  onCustomSizeCommit: () => void
  agentAutoImageCount: boolean
  outputImageLimit: number
  nInput: string
  setNInputFocused: (focused: boolean) => void
  commitN: () => void
  handleNInputChange: (value: string) => void
  handleNLimitIncreaseAttempt: (preventDefault: () => void) => void
  showAgentNHint: () => void
  hideNLimitHint: () => void
  startAgentNHintTouch: () => void
  clearAgentNHintTouchTimer: () => void
  nLimitHint: HintTooltipState
  nLimitHintText: string
  streamConcurrentByN: boolean
  streamConcurrentHint: HintTooltipState
}) {
  const isDesktop = layout === 'desktop'
  const sizeModeOptions = [
    ...(allowAuto ? [{ label: '自动', value: 'auto' }] : []),
    { label: '按比例', value: 'ratio' },
    ...(allowResolution ? [{ label: '自定义宽高', value: 'resolution' }] : []),
  ]

  return (
    <div className={`grid flex-1 gap-2 text-xs ${isDesktop ? 'grid-cols-5' : 'grid-cols-2'}`}>
      <label className="flex flex-col gap-0.5">
        <span className="ml-1 text-gray-400 dark:text-gray-500">模型</span>
        <Select
          value={apiProfileId}
          onChange={(value) => onApiProfileChange(String(value))}
          options={apiProfileOptions}
          className={selectClass}
        />
      </label>

      {!isNanoBanana && (
        <label className={`flex flex-col gap-0.5 ${
          (isDesktop && sizeMode === 'auto') || (!isDesktop && sizeMode === 'resolution') ? 'col-span-2' : ''
        }`}>
          <span className="ml-1 text-gray-400 dark:text-gray-500">尺寸</span>
          <Select
            value={sizeMode}
            onChange={(value) => onSizeModeChange(value as ImageSizeMode)}
            options={sizeModeOptions}
            showValueTooltips={false}
            className={selectClass}
          />
        </label>
      )}

      {(isNanoBanana || sizeMode === 'ratio') && (
        <>
          <label className="flex flex-col gap-0.5">
            <span className="ml-1 text-gray-400 dark:text-gray-500">{isNanoBanana ? '分辨率' : '基准分辨率'}</span>
            <Select
              value={sizeTier}
              onChange={(value) => onSizeTierChange(String(value))}
              options={sizeTierOptions.map((value) => ({ label: value, value }))}
              showValueTooltips={false}
              className={selectClass}
            />
          </label>
          <label className="flex flex-col gap-0.5">
            <span className="ml-1 text-gray-400 dark:text-gray-500">图像比例</span>
            <Select
              value={sizeRatio}
              onChange={(value) => onSizeRatioChange(String(value))}
              options={sizeRatioOptions.map((value) => ({ label: value, value }))}
              showValueTooltips={false}
              className={selectClass}
            />
          </label>
          {isNanoBanana && (
            <label className="flex flex-col gap-0.5">
              <span className="ml-1 text-gray-400 dark:text-gray-500">清晰度</span>
              <Select
                value={bananaQuality}
                onChange={(value) => onBananaQualityChange(value === 'high' ? 'high' : 'standard')}
                options={[
                  { label: 'standard', value: 'standard' },
                  { label: 'high', value: 'high' },
                ]}
                showValueTooltips={false}
                className={selectClass}
              />
            </label>
          )}
        </>
      )}

      {!isNanoBanana && sizeMode === 'resolution' && (
        <label className="col-span-2 flex flex-col gap-0.5">
          <span className="ml-1 text-gray-400 dark:text-gray-500">具体像素值</span>
          <div className="flex min-w-0 items-center gap-2">
            <input
              value={customWidth}
              onChange={(event) => onCustomWidthChange(event.target.value)}
              onBlur={onCustomSizeCommit}
              onKeyDown={(event) => {
                if (event.key === 'Enter') event.currentTarget.blur()
              }}
              type="number"
              min={1}
              max={3840}
              inputMode="numeric"
              aria-label="图像宽度"
              placeholder="宽度"
              className={inputClass}
            />
            <span className="shrink-0 text-gray-300 dark:text-gray-600">×</span>
            <input
              value={customHeight}
              onChange={(event) => onCustomHeightChange(event.target.value)}
              onBlur={onCustomSizeCommit}
              onKeyDown={(event) => {
                if (event.key === 'Enter') event.currentTarget.blur()
              }}
              type="number"
              min={1}
              max={3840}
              inputMode="numeric"
              aria-label="图像高度"
              placeholder="高度"
              className={inputClass}
            />
          </div>
        </label>
      )}

      <label
        className={`relative flex flex-col gap-0.5 ${
          (isDesktop && sizeMode === 'auto' && !isNanoBanana) || (!isDesktop && sizeMode === 'resolution' && !isNanoBanana) ? 'col-span-2' : ''
        }`}
        onMouseEnter={() => { showAgentNHint(); streamConcurrentHint.show() }}
        onMouseLeave={() => { hideNLimitHint(); streamConcurrentHint.hide() }}
        onTouchStart={() => { startAgentNHintTouch(); streamConcurrentHint.startTouch() }}
        onTouchEnd={() => { clearAgentNHintTouchTimer(); streamConcurrentHint.clearTimer() }}
        onTouchCancel={() => {
          clearAgentNHintTouchTimer()
          hideNLimitHint()
          streamConcurrentHint.hide()
        }}
        onClick={() => { showAgentNHint(); streamConcurrentHint.show() }}
      >
        <span className="ml-1 text-gray-400 dark:text-gray-500">数量</span>
        <input
          value={nInput}
          onChange={(event) => handleNInputChange(event.target.value)}
          onFocus={() => setNInputFocused(true)}
          onBlur={() => {
            setNInputFocused(false)
            commitN()
          }}
          onKeyDown={(event) => {
            if (event.key === 'ArrowUp') handleNLimitIncreaseAttempt(() => event.preventDefault())
          }}
          onWheel={(event) => {
            if (event.deltaY < 0) handleNLimitIncreaseAttempt(() => event.preventDefault())
          }}
          disabled={agentAutoImageCount}
          type={agentAutoImageCount ? 'text' : 'number'}
          min={agentAutoImageCount ? undefined : 1}
          max={agentAutoImageCount ? undefined : outputImageLimit}
          className={`${inputClass} ${agentAutoImageCount ? 'cursor-not-allowed bg-gray-100/50 opacity-50 dark:bg-white/[0.05]' : ''}`}
        />
        <ButtonTooltip visible={nLimitHint.visible} text={nLimitHintText} />
        <ButtonTooltip visible={streamConcurrentByN && streamConcurrentHint.visible && !nLimitHint.visible} text="数量大于 1 时会将多图生成拆分为并发单图" />
      </label>
    </div>
  )
}
