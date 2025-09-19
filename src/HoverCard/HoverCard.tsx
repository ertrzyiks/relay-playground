import { Tooltip } from "@base-ui-components/react/tooltip";

export function HoverCard(props: {
  children: React.ReactNode;
  content: React.ReactNode;
}) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger render={<div>{props.children}</div>} />
      <Tooltip.Portal>
        <Tooltip.Positioner sideOffset={10}>
          <Tooltip.Popup className="bg-gray-300 text-gray-800 px-2 py-1">
            {props.content}
          </Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}
