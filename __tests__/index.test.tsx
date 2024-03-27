import Home from '@/app/page'
import { render } from '@testing-library/react'
 
describe('Home', () => {
  
  it('renders a heading', () => {
    const home = render(<Home />)
    expect(home.container).toBeInTheDocument()
  })

  it('renders quickly', () => {
    let timeStart = Date.now()
    
    render(<Home />)

    let timeEnd = Date.now()

    expect(timeEnd - timeStart).toBeLessThan(500)
  })
})