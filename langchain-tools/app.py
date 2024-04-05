from langchain_community.tools import YouTubeSearchTool

tool = YouTubeSearchTool()

# tool.run("Angkor Wat")
print(tool.run("Angkor Wat, 1"))