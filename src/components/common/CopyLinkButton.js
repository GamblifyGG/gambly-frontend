import { Button } from '@/components/form'
import { useBoolToggle } from "@/hooks/index"
import { Iconify } from "@/components/common"
import { copyToClipboard } from "@/utils/common"

export default function ({ link, duration = 250, className = ""}) {
  const [copyClicked, toggleCopyClicked] = useBoolToggle(duration)

  return (
    <Button
      onClick={() => {
        copyToClipboard(link)
        toggleCopyClicked()
      }} 
      className={className}
    >
      <Iconify icon="line-md:link"/>
      <span className="hidden lg:inline">{ copyClicked ? 'Copied!' : 'Link' }</span>
    </Button>
  )
}
