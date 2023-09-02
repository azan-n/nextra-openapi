/**
 * Render Nextra Tabs Component
 * @param items 
 * @param children 
 * @returns 
 */
export function TabsMdx(items: string[], children: (string | null)[]) {
    if (items.length !== children.length) { throw new Error('TabsMdx: items and children must be the same length'); }
    if (items.length === 0 || children.length === 0) { return '' }
    
    return `
    import {Tab, Tabs} from 'nextra/components';

    <Tabs items={ ${JSON.stringify(items)} }>
        ${children.map((child) => { if (child) { return `<Tab>${child}</Tab>` } else { return '' } }).join(`\n`)}
    </Tabs>
    `
}