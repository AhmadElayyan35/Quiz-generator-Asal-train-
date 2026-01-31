import { DrawerProps } from "@fluentui/react-components";
import * as React from "react";
import {
  Hamburger,
  NavDrawerProps,
} from "@fluentui/react-nav-preview";

import {
  Tooltip,
  useRestoreFocusTarget,
} from "@fluentui/react-components";

import { Category } from "../../Categories/Categories";
import { GetUserDetails } from "../../../APIs/UserDetails/GetUserDetails";
import { Quiz, QuizAttempt } from "../../QuizGenerator/data/quiz";
import { Document } from "../../Category/Category";
import LoadingSpinner from "../../LoadingSpinner";
import { Content, Root } from "./Dashboard.styles";
import DashboardNav from "./DashboardNav";
import DashboardContent from "./DashboardContent";
import { useApi } from "../../../hooks/useApi";




type DrawerType = Required<DrawerProps>["type"];

export const Basic = (props: Partial<NavDrawerProps>) => {
  const [isOpen, setIsOpen] = React.useState(true);
  const [enabledLinks, setEnabledLinks] = React.useState(true);
  const [type, setType] = React.useState<DrawerType>("inline");
  const [isMultiple, setIsMultiple] = React.useState(true);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [quizzes, setQuizzes] = React.useState<Quiz[]>([]);
  const [documents, setDocuments] = React.useState<Document[]>([]);
  const [attempts, setAttempts] = React.useState<QuizAttempt[]>([]);
  const [userName, setUserName] = React.useState<string>("");
  const apiFetch = useApi()

  const restoreFocusTargetAttributes = useRestoreFocusTarget();

  const linkDestination = enabledLinks ? "https://www.bing.com" : "";

  React.useEffect(() => {
    const fetchDetails = async () => {
      try {
        await GetUserDetails(apiFetch, setUserName, setCategories, setDocuments, setQuizzes, setAttempts);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }
    fetchDetails();
  }, []);

  if (!userName) {
    return <LoadingSpinner label="Loading user details..." />;
  }

  return (
    <Root>
      <DashboardNav
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        type={type}
        isMultiple={isMultiple}
        userName={userName}
        linkDestination={linkDestination} />
      <Content>
        <Tooltip content="Toggle navigation pane" relationship="label">
          <Hamburger
            onClick={() => setIsOpen(!isOpen)}
            {...restoreFocusTargetAttributes}
          />
        </Tooltip>

        <DashboardContent
          userName={userName}
          categoriesList={categories}
          documentsList={documents}
          quizzesList={quizzes}
          attemptsList={attempts}
        />


      </Content>

    </Root>
  );
};