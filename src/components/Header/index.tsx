import { HeaderContainer } from './styles'
import { Scroll, Timer } from 'phosphor-react'

import redLogo from '../../assets/red_logo.svg'

export function Header() {
  return (
    <HeaderContainer>
      <img src={redLogo} alt="" />
      <nav>
        <a href="/">
          <Timer size={24} color="#00875F" />
        </a>
        <a href="/history">
          <Scroll size={24} />
        </a>
      </nav>
    </HeaderContainer>
  )
}
