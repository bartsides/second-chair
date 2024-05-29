using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

namespace SecondChair.Api.Entities
{
    public class SecondChairContext(DbContextOptions options) : DbContext(options)
    {
        private IDbContextTransaction _currentTransaction;
        public DbSet<Case> Cases { get; set; }
        public DbSet<Juror> Jurors { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Case>().OwnsOne(c => c.Strikes);

            modelBuilder.Entity<Juror>().HasOne(j => j.Case).WithMany(c => c.Jurors)
                .HasForeignKey(j => j.CaseId).OnDelete(DeleteBehavior.NoAction);
            modelBuilder.Entity<Juror>().Property(j => j.PositionX).HasPrecision(18, 6);
            modelBuilder.Entity<Juror>().Property(j => j.PositionY).HasPrecision(18, 6);
        }

        public async Task BeginTransactionAsync()
        {
            if (_currentTransaction != null)
                return;
            _currentTransaction = await Database.BeginTransactionAsync();
        }

        public async Task CloseTransactionAsync(Exception exception = null)
        {
            try
            {
                if (_currentTransaction != null && exception != null)
                {
                    await _currentTransaction.RollbackAsync();
                    return;
                }

                await SaveChangesAsync();

                await _currentTransaction?.CommitAsync();
            }
            catch (Exception)
            {
                await _currentTransaction.RollbackAsync();

                throw;
            }
            finally
            {
                _currentTransaction?.Dispose();
                _currentTransaction = null;
            }
        }
    }
}
