import React, { useState, useRef, useCallback } from "react";
import { Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Link, Image, Code, Edit, Calendar, User, Eye, FileText, X } from "lucide-react";

export default function BlogPostEditor() {
  const [title, setTitle] = useState("The Rise of Artificial Intelligence in Everyday Life");
  const [activeTab, setActiveTab] = useState("Text");
  const [tags, setTags] = useState(["HeroJourney", "DestinyAndDuty"]);
  const [newTag, setNewTag] = useState("");
  const [wordCount, setWordCount] = useState(1138);
  const [readingTime] = useState("4min");
  const editorRef = useRef(null);

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddTag();
    }
  };

  // Rich text editor functions
  const execCommand = useCallback((command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  }, []);

  const handleFormatting = (command, value = null) => {
    execCommand(command, value);
  };

  const handleInput = () => {
    if (editorRef.current) {
      const text = editorRef.current.innerText;
      setWordCount(text.split(/\s+/).filter((word) => word.length > 0).length);
    }
  };

  const insertLink = () => {
    const url = prompt("Enter URL:");
    if (url) {
      execCommand("createLink", url);
    }
  };

  const insertImage = () => {
    const url = prompt("Enter image URL:");
    if (url) {
      execCommand("insertImage", url);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side - Editor */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Add New Post</h2>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <FileText size={20} />
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">Post</button>
              </div>
            </div>

            {/* Title Input */}
            <div className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="flex-1 text-xl font-semibold text-gray-900 border-none outline-none bg-transparent" placeholder="Enter post title..." />
                <Edit size={16} className="text-gray-400" />
              </div>

              {/* Media/Visual/Text Tabs */}
              <div className="flex items-center gap-1 mb-4">
                <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded">
                  <Image size={14} />
                  Add Media
                </button>
                <div className="flex ml-auto">
                  <button onClick={() => setActiveTab("Visual")} className={`px-3 py-1.5 text-sm font-medium ${activeTab === "Visual" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-gray-900"}`}>
                    Visual
                  </button>
                  <button onClick={() => setActiveTab("Text")} className={`px-3 py-1.5 text-sm font-medium ${activeTab === "Text" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-gray-900"}`}>
                    Text
                  </button>
                </div>
              </div>

              {/* Toolbar */}
              <div className="flex flex-wrap items-center gap-1 mb-4 pb-3 border-b border-gray-200">
                <select className="text-sm border border-gray-300 rounded px-2 py-1" onChange={(e) => handleFormatting("formatBlock", e.target.value)}>
                  <option value="p">Paragraph</option>
                  <option value="h1">Heading 1</option>
                  <option value="h2">Heading 2</option>
                  <option value="h3">Heading 3</option>
                  <option value="h4">Heading 4</option>
                  <option value="h5">Heading 5</option>
                  <option value="h6">Heading 6</option>
                </select>

                <div className="w-px h-6 bg-gray-300 mx-2"></div>

                <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded" onClick={() => handleFormatting("bold")} title="Bold">
                  <Bold size={16} />
                </button>
                <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded" onClick={() => handleFormatting("italic")} title="Italic">
                  <Italic size={16} />
                </button>
                <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded" onClick={() => handleFormatting("underline")} title="Underline">
                  <Underline size={16} />
                </button>
                <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded" onClick={() => handleFormatting("strikeThrough")} title="Strikethrough">
                  <Strikethrough size={16} />
                </button>

                <div className="w-px h-6 bg-gray-300 mx-2"></div>

                <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded" onClick={() => handleFormatting("justifyLeft")} title="Align Left">
                  <AlignLeft size={16} />
                </button>
                <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded" onClick={() => handleFormatting("justifyCenter")} title="Align Center">
                  <AlignCenter size={16} />
                </button>
                <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded" onClick={() => handleFormatting("justifyRight")} title="Align Right">
                  <AlignRight size={16} />
                </button>

                <div className="w-px h-6 bg-gray-300 mx-2"></div>

                <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded" onClick={() => handleFormatting("insertUnorderedList")} title="Bullet List">
                  <List size={16} />
                </button>
                <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded" onClick={() => handleFormatting("insertOrderedList")} title="Numbered List">
                  <ListOrdered size={16} />
                </button>
                <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded" onClick={insertLink} title="Insert Link">
                  <Link size={16} />
                </button>
                <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded" onClick={insertImage} title="Insert Image">
                  <Image size={16} />
                </button>
                <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded" onClick={() => handleFormatting("formatBlock", "pre")} title="Code Block">
                  <Code size={16} />
                </button>
              </div>

              {/* Rich Text Editor */}
              <div className="min-h-96 border border-gray-200 rounded-md">
                <div
                  ref={editorRef}
                  contentEditable={true}
                  className="w-full min-h-96 p-4 text-sm text-gray-700 leading-relaxed outline-none bg-white rounded-md"
                  style={{ whiteSpace: "pre-wrap" }}
                  onInput={handleInput}
                  dangerouslySetInnerHTML={{
                    __html: `
                      <h3>Chapter 3, Revelation From God</h3>
                      <p>Artificial Intelligence (AI) is no longer a distant vision reserved for futuristic speculation — it is a <strong>tangible, rapidly evolving technology</strong> that has become deeply woven into the fabric of modern life. Once confined to the realms of academic research and high-tech laboratories, AI is now present in our smartphones, homes, vehicles, workplaces, and even healthcare systems. This silent revolution is transforming how we live, work, and interact with the world around us.</p>
                      
                      <p>One of the most visible ways AI has entered everyday life is through smart personal assistants like <em>Siri, Alexa, and Google Assistant</em>. These tools leverage natural language processing to respond to voice commands, answer questions, and manage daily tasks, making life more convenient and efficient. Recommendation systems on platforms such as Netflix, Spotify, and YouTube use AI algorithms to learn from our preferences and serve up personalized content that keeps us engaged. Similarly, social media feeds are curated by AI models that analyze user behavior to decide what content to show, increasing relevance — but also raising concerns about echo chambers and data manipulation.</p>
                      
                      <p>In the world of healthcare, AI is empowering professionals to deliver faster and more accurate diagnoses using medical imaging, patient data analysis, and predictive models. Chatbots assist patients with routine inquiries, while AI-driven robots are aiding in surgeries and elderly care. In finance, AI detects fraudulent transactions in real-time and provides users with intelligent budgeting tools and investment recommendations. In transportation, AI powers navigation apps, autonomous vehicles, and dynamic traffic systems designed to reduce congestion and emissions.</p>
                    `,
                  }}
                />
              </div>

              {/* Word Count and Reading Time */}
              <div className="flex items-center gap-4 text-xs text-gray-500 mt-4 pt-4 border-t border-gray-200">
                <span>Word Count: {wordCount}</span>
                <span>Reading Time: {readingTime}</span>
              </div>

              {/* Tags Section */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Tags</h3>
                <div className="flex items-start gap-2">
                  <span className="text-sm text-gray-600 mt-2">Try:</span>
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {tags.map((tag, index) => (
                        <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                          {tag}
                          <button onClick={() => handleRemoveTag(tag)} className="text-gray-400 hover:text-gray-600">
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Add new tag..."
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button onClick={handleAddTag} className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200">
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Preview */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Featured Image */}
            <div className="h-48 bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 relative overflow-hidden">
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-16 h-16 mx-auto mb-4 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <Code size={32} className="text-white" />
                  </div>
                  <div className="text-xs opacity-80">CSS, HTML, JS, C++</div>
                </div>
              </div>
              {/* Decorative code elements */}
              <div className="absolute top-4 left-4 text-white opacity-20 text-xs font-mono">&lt;div&gt;</div>
              <div className="absolute bottom-4 right-4 text-white opacity-20 text-xs font-mono">&lt;/html&gt;</div>
              <div className="absolute top-1/2 right-8 text-white opacity-10 text-2xl font-mono">{}</div>
            </div>

            {/* Preview Content */}
            <div className="p-6">
              {/* Meta Info */}
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <User size={12} />
                  <span>by David Smith</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={12} />
                  <span>05 June, 2023</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye size={12} />
                  <span>HeroJourney</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-xl font-bold text-gray-900 mb-4 leading-tight">{title}</h1>

              {/* Content Preview */}
              <div className="text-sm text-gray-600 leading-relaxed mb-6">
                <p className="mb-4">
                  Artificial Intelligence (AI) is no longer a distant vision reserved for futuristic speculation — it is a tangible, rapidly evolving technology that has become deeply woven into the fabric of modern life. Once confined to
                  the realms of academic research and high-tech laboratories, AI is now present in our smartphones, homes, vehicles, workplaces, and even healthcare systems. This silent revolution is transforming how we live, work, and
                  interact with the world around us.
                </p>
                <p className="mb-4">
                  One of the most visible ways AI has entered everyday life is through smart personal assistants like Siri, Alexa, and Google Assistant. These tools leverage natural language processing to respond to voice commands, answer
                  questions, and manage daily tasks, making life more convenient and efficient. Recommendation systems on platforms such as Netflix, Spotify, and YouTube use AI algorithms to learn from our preferences and serve up
                  personalized content that keeps us engaged. Similarly, social media feeds are curated by AI models that analyze user behavior to decide what content to show, increasing relevance — but also raising concerns about echo
                  chambers and data manipulation.
                </p>
                <p>
                  In the world of healthcare, AI is empowering professionals to deliver faster and more accurate diagnoses using medical imaging, patient data analysis, and predictive models. Chatbots assist patients with routine inquiries,
                  while AI-driven robots are aiding in surgeries and elderly care. In finance, AI detects fraudulent transactions in real-time and provides users with intelligent budgeting tools and investment recommendations. In
                  transportation, AI powers navigation apps, autonomous vehicles, and dynamic traffic systems designed to reduce congestion and emissions.
                </p>
              </div>

              {/* Tags */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-gray-700">Tags:</span>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
