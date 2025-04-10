// This is a collection of custom mark renderers for Sanity Studio

export function TextAlignCenter(props:any){
    // Renders text with center alignment
    return (
        <div style={{textAlign:"center", width:"100%"}}>
            {props.children}
        </div>
    )
}

export function MutedText(props:any){
    // Renders text with muted-foreground color
    // colors are based on the shadcn/ui library: nuetral colors
    return (
        <span style={{color:"hsl(0,0%,63.9%)"}}>{props.children}</span>
    )
}