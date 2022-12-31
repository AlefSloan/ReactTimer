import { differenceInSeconds } from 'date-fns'
import { useContext, useEffect } from 'react'
import { CyclesContext } from '../../../../context/CyclesContext'
import { CountdownContainer, Separator } from './styles'

export function Countdown() {
  const {
    activeCycle,
    amountSecondsPassed,
    markCurrentCycleAsFinished,
    setSecondsPassed,
  } = useContext(CyclesContext)

  const totalActiveCycleSeconds = activeCycle
    ? activeCycle.minutesAmount * 60
    : 0

  const currentSeconds = activeCycle
    ? totalActiveCycleSeconds - amountSecondsPassed
    : 0

  const fullMinutesAmount = Math.floor(currentSeconds / 60)
  const fullSecondsAmount = currentSeconds % 60

  const minutes = String(fullMinutesAmount).padStart(2, '0')
  const seconds = String(fullSecondsAmount).padStart(2, '0')

  useEffect(() => {
    let interval: number

    if (activeCycle) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(),
          activeCycle.startDate,
        )

        if (secondsDifference >= totalActiveCycleSeconds) {
          markCurrentCycleAsFinished()

          setSecondsPassed(totalActiveCycleSeconds)
          clearInterval(interval)
        } else {
          setSecondsPassed(secondsDifference)
        }
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }
  }, [
    activeCycle,
    markCurrentCycleAsFinished,
    setSecondsPassed,
    totalActiveCycleSeconds,
  ])

  useEffect(() => {
    if (activeCycle) {
      document.title = `ReactTimer - ${minutes}:${seconds}`
    }
  }, [activeCycle, minutes, seconds])

  return (
    <CountdownContainer>
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <Separator>:</Separator>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountdownContainer>
  )
}
