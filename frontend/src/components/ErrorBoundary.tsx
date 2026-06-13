import { Component, type ErrorInfo, type ReactNode } from "react";
import { IconAlertTriangle, IconRefresh } from "@tabler/icons-react";

interface ErrorBoundaryProps {
	children: ReactNode;
}

interface ErrorBoundaryState {
	hasError: boolean;
	error: Error | null;
}

export class ErrorBoundary extends Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error("ErrorBoundary caught:", error, errorInfo);
	}

	handleReset = () => {
		this.setState({ hasError: false, error: null });
	};

	render() {
		if (this.state.hasError) {
			return (
				<div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
					<div className="w-full max-w-md text-center">
						<IconAlertTriangle
							size={64}
							className="mx-auto mb-4 text-red-500"
						/>
						<h1 className="mb-2 text-2xl font-bold text-gray-900">
							Terjadi Kesalahan
						</h1>
						<p className="mb-6 text-gray-600">
							Maaf, terjadi kesalahan yang tidak terduga. Silakan coba lagi.
						</p>
						{this.state.error && (
							<pre className="mb-6 max-h-32 overflow-auto rounded-lg bg-gray-100 p-3 text-left text-sm text-gray-700">
								{this.state.error.message}
							</pre>
						)}
						<button
							onClick={this.handleReset}
							className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
						>
							<IconRefresh size={20} />
							Coba Lagi
						</button>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}