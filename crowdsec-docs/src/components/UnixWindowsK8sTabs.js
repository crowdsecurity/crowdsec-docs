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
export default function UnixWindowsK8sTabs({ ...props }) {
    return (
        <Tabs
            defaultValue="nix"
            groupId="console-operating-systems"
            values={[
                { label: "Linux/Freebsd", value: "nix" },
                { label: "Windows", value: "windows" },
                { label: "Kubernetes", value: "kubernetes" },
            ]}
        >
            <TabItem value="nix">
                <CodeBlock className="language-bash">{props.bash}</CodeBlock>
            </TabItem>
            <TabItem value="windows">
                {props.cmd === undefined && props.powershell === undefined ? (
                    <p>Code snippet not available for Windows</p>
                ) : null}
                {props.cmd === undefined && props.powershell !== undefined ? (
                    <CodeBlock className="language-bash">
                        {props.powershell}
                    </CodeBlock>
                ) : null}
                {props.cmd !== undefined && props.powershell !== undefined ? (
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
                ) : null}
            </TabItem>
            <TabItem value="kubernetes">
                {props.yaml === undefined && props.k8s === undefined ? (
                    <p>Code snippet not available for Kubernetes</p>
                ) : null}
                {props.yaml !== undefined ? (
                    <CodeBlock className="language-yaml">{props.yaml}</CodeBlock>
                ) : null}
                {props.k8s !== undefined ? (
                    <CodeBlock className="language-bash">{props.k8s}</CodeBlock>
                ) : null}
            </TabItem>
        </Tabs>
    );
}
