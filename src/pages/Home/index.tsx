import { useEffect, useState } from 'react'
import { HandPalm, Play } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { differenceInSeconds } from 'date-fns'
import {
  CountdownContainer,
  FormButton,
  FormContainer,
  HomeContainer,
  MinutesAmount,
  Separator,
  StopButton,
  TaskInput,
} from './styles'

const createNewCycleSubmitSchema = zod.object({
  task: zod.string().min(1, 'Insira uma tarefa'),
  minutesAmount: zod
    .number()
    .min(5, 'O ciclo precisa ser de no mínimo 5 minutos')
    .max(60, 'O ciclo precisa ser de no máximo 60 minutos'),
})

type NewCycleFormData = zod.infer<typeof createNewCycleSubmitSchema>

interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptDate?: Date
  finishedDate?: Date
}

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(createNewCycleSubmitSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  const totalActiveCycleSeconds = activeCycle
    ? activeCycle.minutesAmount * 60
    : 0

  function handleCreateNewCycleSubmit(data: NewCycleFormData) {
    const id = String(new Date().getTime())
    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    setCycles((state) => [...state, newCycle])
    setActiveCycleId(id)
    setAmountSecondsPassed(0)
  }

  function handleInterruptCycle() {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, interruptDate: new Date() }
        } else {
          return cycle
        }
      }),
    )

    reset()
    setActiveCycleId(null)
  }

  useEffect(() => {
    let interval: number

    if (activeCycle) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(),
          activeCycle.startDate,
        )

        if (secondsDifference >= totalActiveCycleSeconds) {
          setCycles((state) =>
            state.map((cycle) => {
              if (cycle.id === activeCycleId) {
                return { ...cycle, finishedDate: new Date() }
              } else {
                return cycle
              }
            }),
          )

          setAmountSecondsPassed(totalActiveCycleSeconds)
          clearInterval(interval)
        } else {
          setAmountSecondsPassed(secondsDifference)
        }
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }
  }, [activeCycle, activeCycleId, totalActiveCycleSeconds])

  const currentSeconds = activeCycle
    ? totalActiveCycleSeconds - amountSecondsPassed
    : 0

  const fullMinutesAmount = Math.floor(currentSeconds / 60)
  const fullSecondsAmount = currentSeconds % 60

  const minutes = String(fullMinutesAmount).padStart(2, '0')
  const seconds = String(fullSecondsAmount).padStart(2, '0')

  useEffect(() => {
    if (activeCycle) {
      document.title = `ReactTimer - ${minutes}:${seconds}`
    }
  }, [activeCycle, minutes, seconds])

  const task = watch('task')
  const isSubmitDisable = !task

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycleSubmit)} action="">
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput
            id="task"
            list="task-suggestions"
            disabled={!!activeCycle}
            placeholder="Dê um nome para o seu projeto"
            {...register('task')}
          />

          <datalist id="task-suggestions">
            <option value="Projeto 1" />
            <option value="Projeto 2" />
            <option value="Projeto 3" />
            <option value="Projeto 4" />
          </datalist>

          <label htmlFor="minutesAmount">durante</label>
          <MinutesAmount
            id="minutesAmount"
            step={5}
            min={5}
            max={60}
            type="number"
            disabled={!!activeCycle}
            placeholder="00"
            {...register('minutesAmount', { valueAsNumber: true })}
          />

          <span>minutos.</span>
        </FormContainer>

        <CountdownContainer>
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
          <Separator>:</Separator>
          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>
        </CountdownContainer>

        {activeCycle ? (
          <StopButton onClick={handleInterruptCycle} type="button">
            <HandPalm size={24} />
            Interromper
          </StopButton>
        ) : (
          <FormButton disabled={isSubmitDisable} type="submit">
            <Play size={24} />
            Começar
          </FormButton>
        )}
      </form>
    </HomeContainer>
  );
}
