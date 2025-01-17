import { type GetServerSidePropsContext } from "next";
import ProjectLayout from "@/layouts/Project";
import Project from "@/models/projects";
import { getOne as getSinglePr } from "@/models/pullRequest";
import { withAccessControl } from "@/utils/withAccessControl";
import {
  Branch,
  MembershipStatus,
  Project as ProjectType,
  PullRequest,
  UserRole,
} from "@prisma/client";
import { GitPullRequest, GitPullRequestClosed } from "lucide-react";
import { UserType } from "prisma/seeds/types";
import DetailedPrTitle from "@/components/pulls/DetailedPrTitle";
import EnvDiffViewer from "@/components/pulls/EnvDiffViewer";
import { Button } from "@/components/theme";

/**
 * A functional component that represents a pull request detail.
 * @param {Projects} props.projects - The projects the user has access to.
 * @param {PullRequest & {createdBy: User}} props.pullRequest - The projects the user has access to.
 * @param {currentProject} props.currentProject - The current project.
 * @param {currentRole} props.currentRole - The user role in current project.
 */

interface Props {
  projects: ProjectType[];
  pullRequest: PullRequest & {
    createdBy: UserType;
  };
  currentProject: ProjectType;
  currentRole: UserRole;
}

export default function PullRequestDetailPage({
  projects,
  currentProject,
  currentRole,
  pullRequest,
}: Props) {
  const { baseBranch, currentBranch } = pullRequest as any & {
    baseBranch: Branch;
    currentBranch: Branch;
  };

  return (
    <ProjectLayout
      tab="pr"
      projects={projects}
      currentProject={currentProject}
      currentRole={currentRole}
    >
      <div className="w-full">
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-6">
            <DetailedPrTitle
              author={pullRequest.createdBy.name}
              title={pullRequest.title}
              prId={pullRequest.prId}
              status={pullRequest.status}
              base={baseBranch?.name}
              current={currentBranch?.name}
            />
          </div>
          <div className="col-span-6 gap-2">
            <Button
              className="float-right ml-3"
              leftIcon={
                <GitPullRequest className="mr-2 h-4 w-4" strokeWidth={2} />
              }
            >
              Merge pull request
            </Button>

            <Button
              leftIcon={
                <GitPullRequestClosed
                  className="mr-2 h-4 w-4"
                  strokeWidth={2}
                />
              }
              variant="danger-outline"
              className="float-right"
            >
              Close pull request
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-8 w-full">
        <EnvDiffViewer baseBranch={baseBranch} currentBranch={currentBranch} />
      </div>
    </ProjectLayout>
  );
}

const getPageServerSideProps = async (context: GetServerSidePropsContext) => {
  // @ts-ignore
  const { slug: projectSlug, prId } = context.params;

  const project = await Project.findBySlug(projectSlug);
  const projectId = project.id;

  const pullRequest = await getSinglePr({ projectId, prId: Number(prId) });


  return {
    props: {
      pullRequest: JSON.parse(JSON.stringify(pullRequest)),
    },
  };
};

export const getServerSideProps = withAccessControl({
  getServerSideProps: getPageServerSideProps,
  hasAccess: {
    roles: [
      UserRole.maintainer,
      UserRole.developer,
      UserRole.guest,
      UserRole.owner,
    ],
    statuses: [MembershipStatus.active],
  },
});
