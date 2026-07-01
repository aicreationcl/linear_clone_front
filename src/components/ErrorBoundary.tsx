import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  message: string
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, message: '' }
  }

  static getDerivedStateFromError(error: unknown): State {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return { hasError: true, message }
  }

  handleReload() {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
          <div className="w-10 h-10 rounded-full bg-red-400/15 flex items-center justify-center">
            <span className="text-red-400 text-lg">!</span>
          </div>
          <div>
            <p className="text-content-primary text-sm font-medium mb-1">Algo salió mal</p>
            <p className="text-content-secondary text-xs max-w-xs">{this.state.message}</p>
          </div>
          <button
            onClick={this.handleReload}
            className="text-xs px-3 py-1.5 bg-surface-elevated border border-surface-border rounded text-content-primary hover:bg-surface-border transition-colors"
          >
            Recargar página
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
