import React, { useState } from 'react'
import { Switch } from '@headlessui/react'

const CustomSwitch = ({ label, checked = false, as = 'switch' }) => {
  const [enabled, setEnabled] = useState(checked)

  const asMap = {
    switch: {
      cont: `${enabled ? 'bg-primary' : 'bg-dark-350'}
      relative inline-flex h-[24px] w-[47px] shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white/75`,
      toggle: `${enabled ? 'translate-x-[27px]' : 'translate-x-[4px]'}
      pointer-events-none absolute top-[4px] inline-block h-[16px] w-[16px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`
    },
    cbox: {
      cont: `${enabled ? 'bg-primary' : 'border-2 border-dark-260'}
      relative inline-flex h-[24px] w-[24px] shrink-0 cursor-pointer rounded-[6px] flex items-center justify-center transition duration-100 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white/75`,
      toggle: `${enabled ? 'opacity-100' : 'opacity-0'}
      pointer-events-none w-[12px] h-[12px] bg-white rounded-[3px] transition duration-100 ease-in-out`
    }
  }

  const classes = asMap[as]

  return (
    <Switch.Group>
      <div className="flex mb-5">
      <Switch
        checked={enabled}
        onChange={setEnabled}
        className={classes.cont}
      >
        <span className="sr-only">Use setting</span>
        <span
          aria-hidden="true"
          className={classes.toggle}
        />
      </Switch>
      { label && <Switch.Label className="ml-4">{label}</Switch.Label> }
      </div>
    </Switch.Group>
  )
}
