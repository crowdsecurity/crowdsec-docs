import React from "react";
import styles from "./index.module.css";

type Props = {
	children: React.ReactNode;
};

export default function PathCards({ children }: Props) {
	return <div className={styles.row}>{children}</div>;
}
