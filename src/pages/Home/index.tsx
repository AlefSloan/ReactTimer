import { Play } from 'phosphor-react'
import {
  CountdownContainer,
  FormButton,
  FormContainer,
  HomeContainer,
  MinutesAmount,
  Separator,
  TaskInput,
} from './styles'

export function Home() {
  return (
    <HomeContainer>
      <form action="">
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput
            id="task"
            list="task-suggestions"
            placeholder="Dê um nome para o seu projeto"
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
            placeholder="00"
          />

          <span>minutos.</span>
        </FormContainer>

        <CountdownContainer>
          <span>0</span>
          <span>0</span>
          <Separator>:</Separator>
          <span>0</span>
          <span>0</span>
        </CountdownContainer>

        <FormButton type="submit">
          <Play size={24} />
          Começar
        </FormButton>
      </form>
    </HomeContainer>
  )
}