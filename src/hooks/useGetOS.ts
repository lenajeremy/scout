export function useGetOS(): "macOS" | "mobile" | "windows" | "linux" {
    if (navigator.platform.toLowerCase().indexOf("mac") != -10) return "macOS"
    if (navigator.platform.toLowerCase() === "win32") return 'windows'
    if (navigator.platform.toLowerCase().indexOf('linux') != -1) return 'linux'
    return 'mobile'
}