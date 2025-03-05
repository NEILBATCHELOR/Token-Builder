import React, { useState, useEffect } from "react";
import TokenConfigurationForm from "./TokenConfigurationForm";
import ProjectSelector from "./ProjectSelector";
import { Project, ProjectFormData } from "@/types/project";
import { TokenFormData } from "@/types/token";
import {
  getProjects,
  createProject,
  deleteProject,
  getTokens,
  createToken,
} from "@/lib/supabaseService";
import { toast } from "@/components/ui/use-toast";
import { Header } from "./layout/Header";
import { Sidebar } from "./layout/Sidebar";
import TokenStandardGuide from "./TokenStandardGuide";
import TokenPreviewPanel from "./TokenPreviewPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import MetadataEditor from "./MetadataEditor";
import ContractPreview from "./ContractPreview";
import { TransactionHistory } from "./TransactionHistory";

interface HomeProps {
  onConfigurationComplete?: (data: any) => void;
}

const Home = ({ onConfigurationComplete = () => {} }: HomeProps) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project>();
  const [tokenData, setTokenData] = useState<TokenFormData | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("token-blocks");
  const [completionProgress, setCompletionProgress] = useState(0);

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      loadTokens(selectedProject.id);
    }
  }, [selectedProject]);

  // Calculate completion progress based on form data
  useEffect(() => {
    if (tokenData) {
      let progress = 0;
      if (tokenData.name) progress += 20;
      if (tokenData.symbol) progress += 20;
      if (tokenData.blocks && tokenData.blocks.length > 0) progress += 20;
      if (tokenData.metadata && Object.keys(tokenData.metadata).length > 0)
        progress += 20;
      if (tokenData.status !== "DRAFT") progress += 20;
      setCompletionProgress(progress);
    }
  }, [tokenData]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const projectsData = await getProjects();
      setProjects(
        projectsData.map((p) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          createdAt: p.created_at,
          tokens: [],
        })),
      );
    } catch (error) {
      console.error("Error loading projects:", error);
      toast({
        title: "Error",
        description: "Failed to load projects",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadTokens = async (projectId: string) => {
    try {
      setLoading(true);
      const tokensData = await getTokens(projectId);
      if (tokensData.length > 0) {
        // Convert from database format to app format
        const token = tokensData[0];
        setTokenData({
          name: token.name,
          symbol: token.symbol,
          decimals: token.decimals,
          standard: token.standard,
          blocks: token.blocks,
          metadata: token.metadata,
          status: token.status,
          reviewers: token.reviewers,
          approvals: token.approvals,
          contractPreview: token.contract_preview,
        });
      } else {
        setTokenData(null);
      }
    } catch (error) {
      console.error("Error loading tokens:", error);
      toast({
        title: "Error",
        description: "Failed to load token configurations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProjectCreate = async (projectData: ProjectFormData) => {
    try {
      setLoading(true);
      const newProject = await createProject(projectData);
      const formattedProject: Project = {
        id: newProject.id,
        name: newProject.name,
        description: newProject.description,
        createdAt: newProject.created_at,
        tokens: [],
      };
      setProjects((prev) => [...prev, formattedProject]);
      setSelectedProject(formattedProject);
      toast({
        title: "Success",
        description: "Project created successfully",
      });
    } catch (error) {
      console.error("Error creating project:", error);
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProjectDelete = async (projectId: string) => {
    try {
      setLoading(true);
      await deleteProject(projectId);
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      if (selectedProject?.id === projectId) {
        setSelectedProject(undefined);
        setTokenData(null);
      }
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting project:", error);
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTokenSubmit = async (data: TokenFormData) => {
    if (!selectedProject) {
      toast({
        title: "Error",
        description: "Please select or create a project first",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      await createToken(selectedProject.id, data);
      toast({
        title: "Success",
        description: "Token configuration saved successfully",
      });
      onConfigurationComplete(data);
    } catch (error) {
      console.error("Error saving token configuration:", error);
      toast({
        title: "Error",
        description: "Failed to save token configuration",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          tokenStatus={tokenData?.status}
        />
        <div className="flex-1 p-6">
          <div className="mb-6 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Token Configuration</h1>
                <p className="text-muted-foreground mt-1">
                  Design and configure your token with our intuitive interface
                </p>
              </div>
              <div className="w-64">
                <ProjectSelector
                  projects={projects}
                  selectedProject={selectedProject}
                  onProjectSelect={setSelectedProject}
                  onProjectCreate={handleProjectCreate}
                  onProjectDelete={handleProjectDelete}
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Progress value={completionProgress} className="h-2" />
              </div>
              <div className="text-sm font-medium">
                {completionProgress}% Complete
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="w-full">
              {activeSection === "token-blocks" && (
                <Tabs defaultValue="form" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="form">Configuration</TabsTrigger>
                    <TabsTrigger value="guide">
                      Token Standards Guide
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="form" className="mt-4">
                    <TokenConfigurationForm
                      onSubmit={handleTokenSubmit}
                      initialData={
                        tokenData || {
                          name: "",
                          symbol: "",
                          decimals: 18,
                          standard: "ERC20",
                          metadata: {
                            description: "",
                            external_url: "",
                            is_transferable: true,
                            max_supply: 1000000,
                          },
                          status: "DRAFT",
                        }
                      }
                      onChange={setTokenData}
                    />
                  </TabsContent>
                  <TabsContent value="guide" className="mt-4">
                    <TokenStandardGuide />
                  </TabsContent>
                </Tabs>
              )}

              {activeSection === "contract" && (
                <div className="w-full">
                  <div className="bg-white p-6 rounded-lg border">
                    <h2 className="text-2xl font-semibold mb-4">
                      Smart Contract
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      Review and customize your token's smart contract.
                    </p>
                    <div className="flex justify-between mt-6">
                      <Button
                        variant="outline"
                        onClick={() => setActiveSection("token-blocks")}
                      >
                        Previous: Token Blocks
                      </Button>
                      <Button onClick={() => setActiveSection("history")}>
                        Next: History
                      </Button>
                    </div>
                  </div>
                  <div className="mt-6">
                    <TokenPreviewPanel
                      tokenDetails={
                        tokenData || {
                          name: "Example Token",
                          symbol: "EXT",
                          decimals: 18,
                          standard: "ERC20",
                          metadata: {
                            description: "An example token for demonstration",
                            properties: {
                              canTransfer: true,
                              isMintable: true,
                            },
                          },
                        }
                      }
                    />
                  </div>
                </div>
              )}

              {activeSection === "history" && (
                <div className="bg-white p-6 rounded-lg border">
                  <h2 className="text-2xl font-semibold mb-4">
                    Transaction History
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    View transaction history and configuration changes.
                  </p>
                  <div className="space-y-4">
                    <TransactionHistory />
                  </div>
                  <div className="flex justify-between mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setActiveSection("contract")}
                    >
                      Previous: Contract
                    </Button>
                    <Button onClick={handleTokenSubmit}>
                      Save All Changes
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
