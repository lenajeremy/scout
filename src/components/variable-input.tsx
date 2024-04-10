import * as React from 'react'
import { useAppSelector } from '@/store'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { FIND_VARIABLE_REGEX } from '@/hooks/useReplaceVariableString'


interface VariableInputProps {
    intialValue?: string,
    onChange?: (newValue: string) => void
}

function VariableInput(props: VariableInputProps) {
    const [showVariables, setShowVariables] = React.useState<boolean>(false)
    const { collections, activeCollectionId } = useAppSelector(store => store.collections)
    const variables = React.useMemo(() => {
        return collections.find(c => c.id === activeCollectionId)?.variables || []
    }, [activeCollectionId, collections])

    const [htmlContent, setHtmlContent] = React.useState('')
    const editableDivRef = React.useRef<HTMLDivElement>(null)
    const cursorPositionRef = React.useRef(0)

    const handleInputChange = (e: React.FormEvent<HTMLDivElement>) => {
        const currentCursorPosition = getCaretPosition()
        cursorPositionRef.current = currentCursorPosition;

        let textContent = e.currentTarget.textContent || ''
        updateInnerHTML(textContent)

        if (textContent.endsWith('{')) {
            setShowVariables(true)
        }
    }

    const setCursorPosition = () => {
        const selection = window.getSelection()!;
        const range = document.createRange();
        const editableDiv = editableDivRef.current!;

        if (editableDiv.childNodes.length) {
            const lastChild = editableDiv.childNodes[editableDiv.childNodes.length - 1];
            if (lastChild.nodeType === Node.TEXT_NODE) {
                range.setStart(lastChild, (lastChild.textContent || '').length); // Use the length of the text node
            } else {
                range.selectNodeContents(lastChild);
            }
            range.collapse(false); // Set collapse to false to move cursor to the end
            selection.removeAllRanges();
            selection.addRange(range);
        }
    };

    React.useEffect(() => {
        setCursorPosition()
        props.onChange && props.onChange(editableDivRef.current?.textContent || '')
    })

    React.useEffect(() => {
        if (props.intialValue) updateInnerHTML(props.intialValue)
    }, [props.intialValue])

    const getCaretPosition = () => {
        const selection = window.getSelection()!;
        if (selection.rangeCount === 0) return 0;

        const range = selection.getRangeAt(0).cloneRange();
        range.selectNodeContents(editableDivRef.current!);
        range.setEnd(selection.anchorNode!, selection.anchorOffset);

        return range.toString().length;
    };

    const onSelectVariable = React.useCallback(function (variableKey: string) {
        let initialTextContent = editableDivRef.current?.textContent || ''
        initialTextContent = initialTextContent.replace(/({)+$/, '')
        const newTextContent = `${initialTextContent}{{${variableKey}}}`
        updateInnerHTML(newTextContent)
    }, [])

    const updateInnerHTML = (initialString: string) => {
        initialString = initialString.replaceAll(FIND_VARIABLE_REGEX, match => `<span class = 'text-[#0085FF]'>${match}</span>`)
        const newInnerHTML = `<span>${initialString}</span>`
        setHtmlContent(newInnerHTML)
    }

    return (
        <div className='w-full relative'>
            <div
                contentEditable
                ref={editableDivRef}
                onInput={handleInputChange}
                className="flex h-9 w-full items-center rounded-md border border-neutral-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
            <DropdownMenu open={showVariables} onOpenChange={(open) => {
                setShowVariables(open)
                setTimeout(() => {
                    editableDivRef.current?.focus()
                }, 400)
            }}>
                <DropdownMenuTrigger asChild>
                    <button className='absolute opacity-0 top-1/2 -translate-y-1/2 w-32 pointer-events-none'>-</button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    {
                        variables.map(v => (
                            <DropdownMenuItem key={v.value} onClick={() => onSelectVariable(v.key)}>
                                {v.key}
                            </DropdownMenuItem>
                        ))
                    }
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default VariableInput