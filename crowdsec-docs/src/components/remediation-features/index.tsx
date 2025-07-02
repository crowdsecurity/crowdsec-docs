import React from "react"
import styles from "./RemediationFeatures.module.css"
import useBaseUrl from "@docusaurus/useBaseUrl"

const RemediationFeatures = (): React.JSX.Element => {
    return (
        <section className={styles.remediations}>
            <div className="container">
                <h1 className="remediationTitle">
                    {" "}
                    Examples of detected behaviors{" "}
                </h1>
                <div
                    style={{ justifyContent: "center", paddingTop: "10px" }}
                    className="row"
                >
                    <img
                        src={useBaseUrl("/img/remediations.png")}
                        width="75%"
                        height="75%"
                    />
                </div>
            </div>
        </section>
    )
}

export default RemediationFeatures
