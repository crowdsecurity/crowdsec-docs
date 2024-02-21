import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import CodeBlock from "@theme/CodeBlock";

/*
    * This component is used to display code snippets for both Unix and Windows operating systems.
    * It uses the Docusaurus Tabs component to display the code snippets for both operating systems.
    * The component takes in three props: bash, powershell, and cmd.
    * The bash prop is used to display the code snippet for Unix operating systems.
    * The powershell prop is used to display the code snippet for Windows Powershell.
    * The cmd prop is used to display the code snippet for Windows Command Prompt.
*/
export default function UnixWindowsTabs({ ...props }) {
    return (
        <Tabs
            defaultValue="nix"
            groupId="console-operating-systems"
            values={[
                { label: "Linux/Freebsd", value: "nix" },
                { label: "Windows", value: "windows" },
            ]}
        >
            <TabItem value="nix">
                <CodeBlock className="language-bash">{props.bash}</CodeBlock>
            </TabItem>
            <TabItem value="windows">
                <Tabs
                    defaultValue="powershell"
                    groupId="windows-terminal"
                    values={[
                        { label: "Powershell", value: "powershell" },
                        { label: "CMD", value: "terminal" },
                    ]}
                >
                    <TabItem value="powershell">
                        <CodeBlock className="language-bash">
                            {props.powershell}
                        </CodeBlock>
                    </TabItem>
                    <TabItem value="terminal">
                        <CodeBlock className="language-bash">
                            {props.cmd}
                        </CodeBlock>
                    </TabItem>
                </Tabs>
            </TabItem>
        </Tabs>
    );
}
