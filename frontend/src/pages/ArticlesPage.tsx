import { useState } from "react";
import type { Article } from "../types/article";
import { useArticles } from "../hooks/useArticles";
import { deleteArticle } from "../api/articleApi";
import { ArticleTable } from "../components/ArticleTable";
import { ArticleForm } from "../components/ArticleForm";
import { StockMovementForm } from "../components/StockMovementForm";
import { Modal } from "../components/ui/Modal";
import { Button } from "../components/ui/Button";

type ModalState =
  | { type: "none" }
  | { type: "create" }
  | { type: "edit"; article: Article }
  | { type: "supply"; article: Article }
  | { type: "inventory"; article: Article };

export function ArticlesPage() {
  const { articles, isLoading, error, refresh } = useArticles();
  const [modal, setModal] = useState<ModalState>({ type: "none" });

  const closeModal = () => setModal({ type: "none" });

  const handleSuccess = async () => {
    closeModal();
    await refresh();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Supprimer cet article ?")) return;
    try {
      await deleteArticle(id);
      await refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur lors de la suppression.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Gestion de stocks</h1>
            <p className="text-sm text-gray-500">Back office — Billet Réduc</p>
          </div>
          <Button variant="primary" onClick={() => setModal({ type: "create" })}>
            + Nouvel article
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {isLoading && <p className="text-center text-gray-500 py-8">Chargement...</p>}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        {!isLoading && !error && (
          <ArticleTable
            articles={articles}
            onEdit={(article) => setModal({ type: "edit", article })}
            onDelete={handleDelete}
            onSupply={(article) => setModal({ type: "supply", article })}
            onInventory={(article) => setModal({ type: "inventory", article })}
          />
        )}
      </main>

      <Modal
        isOpen={modal.type === "create"}
        title="Nouvel article"
        onClose={closeModal}
      >
        <ArticleForm onSuccess={handleSuccess} onCancel={closeModal} />
      </Modal>

      <Modal
        isOpen={modal.type === "edit"}
        title="Modifier l'article"
        onClose={closeModal}
      >
        {modal.type === "edit" && (
          <ArticleForm
            articleToEdit={modal.article}
            onSuccess={handleSuccess}
            onCancel={closeModal}
          />
        )}
      </Modal>

      <Modal
        isOpen={modal.type === "supply"}
        title="Approvisionner"
        onClose={closeModal}
      >
        {modal.type === "supply" && (
          <StockMovementForm
            article={modal.article}
            mode="supply"
            onSuccess={handleSuccess}
            onCancel={closeModal}
          />
        )}
      </Modal>

      <Modal
        isOpen={modal.type === "inventory"}
        title="Inventaire"
        onClose={closeModal}
      >
        {modal.type === "inventory" && (
          <StockMovementForm
            article={modal.article}
            mode="inventory"
            onSuccess={handleSuccess}
            onCancel={closeModal}
          />
        )}
      </Modal>
    </div>
  );
}