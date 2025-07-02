import React from "react"
import Tabs from "@theme/Tabs"
import TabItem from "@theme/TabItem"
import CodeBlock from "@theme/CodeBlock"
import {
    cibKubernetes,
    cibLinux,
    cibWindows,
    cibPowershell,
    cilShortText,
    cibDocker,
    cilDollar,
} from "@coreui/icons"
/*
 * This component is used to display code snippets for both Unix and Windows operating systems.
 * It uses the Docusaurus Tabs component to display the code snippets for both operating systems.
 * The component takes in three props: bash, powershell, and cmd.
 * The bash prop is used to display the code snippet for Unix operating systems.
 * The powershell prop is used to display the code snippet for Windows Powershell.
 * The cmd prop is used to display the code snippet for Windows Command Prompt.
 */
const FormattedTabs = ({ ...props }): React.JSX.Element => {
    const values = []
    let defaultValue = ""

    if (props.bash !== undefined) {
        defaultValue = "nix"
        values.push({ label: "Linux/Freebsd", value: "nix", icon: cibLinux })
    }
    if (props.powershell !== undefined) {
        if (defaultValue === "") {
            defaultValue = "windows"
        }
        values.push({ label: "Windows", value: "windows", icon: cibWindows })
    }

    if (props.docker !== undefined || props.dockerCompose !== undefined) {
        if (defaultValue === "") {
            defaultValue = "docker"
        }
        values.push({ label: "Docker", value: "docker", icon: cibDocker })
    }

    if (props.k8s !== undefined || props.yaml !== undefined) {
        if (defaultValue === "") {
            defaultValue = "kubernetes"
        }
        values.push({
            label: "Kubernetes",
            value: "kubernetes",
            icon: cibKubernetes,
        })
    }

    return (
        <Tabs
            defaultValue={defaultValue}
            groupId="console-operating-systems"
            values={values}
        >
            <TabItem value="nix">
                <CodeBlock className="language-bash">{props.bash}</CodeBlock>
            </TabItem>
            <TabItem value="windows">
                {props.cmd === undefined && props.powershell !== undefined ? (
                    <CodeBlock className="language-bash">
                        {props.powershell}
                    </CodeBlock>
                ) : null}
                {props.cmd !== undefined && props.powershell === undefined ? (
                    <CodeBlock className="language-bash">{props.cmd}</CodeBlock>
                ) : null}
                {props.cmd !== undefined && props.powershell !== undefined ? (
                    <Tabs
                        defaultValue="powershell"
                        groupId="windows-terminal"
                        values={[
                            {
                                label: "Powershell",
                                value: "powershell",
                                icon: cibPowershell,
                            },
                            {
                                label: "CMD",
                                value: "terminal",
                                icon: cilShortText,
                            },
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
            <TabItem value="docker">
                {props.docker !== undefined &&
                props.dockerCompose === undefined ? (
                    <CodeBlock className="language-bash">
                        {props.docker}
                    </CodeBlock>
                ) : null}

                {props.dockerCompose !== undefined &&
                props.docker === undefined ? (
                    <CodeBlock language="yaml">{props.dockerCompose}</CodeBlock>
                ) : null}

                {props.dockerCompose !== undefined &&
                props.docker !== undefined ? (
                    <Tabs
                        defaultValue="exec"
                        groupId="docker-selection"
                        values={[
                            {
                                label: "Exec",
                                value: "exec",
                                icon: cilDollar,
                            },
                            {
                                label: "Compose",
                                value: "compose",
                                icon: cilShortText,
                            },
                        ]}
                    >
                        <TabItem value="exec">
                            <CodeBlock className="language-bash">
                                {props.docker}
                            </CodeBlock>
                        </TabItem>
                        <TabItem value="compose">
                            <CodeBlock language="yaml">
                                {props.dockerCompose}
                            </CodeBlock>
                        </TabItem>
                    </Tabs>
                ) : null}
            </TabItem>
            <TabItem value="kubernetes">
                {props.yaml !== undefined ? (
                    <CodeBlock language="yaml">{props.yaml}</CodeBlock>
                ) : null}
                {props.k8s !== undefined ? (
                    <CodeBlock className="language-bash">{props.k8s}</CodeBlock>
                ) : null}
            </TabItem>
        </Tabs>
    )
}

export default FormattedTabs
