import { Github, Linkedin } from 'lucide-react'
import logo from '../../assets/furia.png'

export const Header: React.FC = () => {
  return (
    <div className="flex items-center gap-2 -top-1 z-40 sticky mt-0 max-xl:bg-background w-full justify-between">
      <div className='flex flex-row items-center'>
        <img src={logo} alt="Furia logo" className='w-12' />
        <h2 className='font-bold'>Furioso AI</h2>
      </div>
      <div className='flex flex-row gap-6 items-center'>
        <a href="https://github.com/jpbrab0" target='_blank'>
          <Github size={30} />
        </a>
        <a href="https://linkedin.com/in/jpresdev" target='_blank'>
          <Linkedin size={30} />
        </a>
      </div>
    </div>
  )
}